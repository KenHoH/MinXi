# ContentDetail.tsx - Logic Separation & Issue Analysis

## 🔴 PRIMARY ISSUE: Why handleComment Failed

### Root Cause

The original `handleComment` function was **using hooks inside an async function**, which violates React rules:

```tsx
// ❌ WRONG - Hooks called inside async function
export const handleComment = async (...) => {
  const { user } = useAuthContext();  // ❌ Hook called in async function
  const { updateComment } = useContentService();  // ❌ Hook called in async function
  const { create } = useCommentService();  // ❌ Hook called in async function
  const { showToast } = useToast();  // ❌ Hook called in async function
  // ...
}
```

**Why this breaks:**

1. React hooks can only be called at the top level of React components
2. Async functions create a closure that delays execution
3. By the time the async function executes, the hook context might be lost
4. The component might unmount, causing "Cannot read property of undefined" errors

### Secondary Issues

**In ContentDetail.tsx:**

```tsx
// ❌ WRONG - Incomplete parameters passed
await handleComment(parentId, content.content_id, commentText);
```

The original call was missing critical parameters:

- `user.user_id` - needed for comment creation
- `user.area_id` - needed for updating content counts
- `updateComment` function - not passed, causing undefined function call
- `create` function - not passed, causing undefined function call
- `showToast` function - not passed, no error feedback
- Input validation - no check for empty comments

---

## ✅ SOLUTION: Separating Logic from UI

### 1. **Fix handelComment.tsx**

**Changed from:** Async function with internal hooks
**Changed to:** Pure async function accepting all dependencies as parameters

```tsx
// ✅ CORRECT - Dependencies injected as parameters
export const handleComment = async (
  parentId: number | null,
  contentId: number,
  commentText: string,
  userId: string,
  areaId: number,
  updateComment: Function,
  create: Function,
  showToast: Function
) => {
  // Validate input
  if (!commentText || commentText.trim().length === 0) {
    showToast("Comment cannot be empty", "", "warning");
    return false; // ← Returns boolean for caller to check success
  }

  try {
    await updateComment(contentId, areaId, { delta: 1 });
    await create({
      content_id: contentId,
      parent_id: parentId ? parentId : 0,
      text: commentText.trim(),
      creator_id: userId,
      id: 0,
    });

    showToast("Comment added successfully", "", "success");
    return true; // ← Indicates success
  } catch (error) {
    console.error("Failed to create comment:", error);
    showToast("Failed to add comment", "", "error");
    return false; // ← Indicates failure
  }
};
```

**Benefits:**

- No hooks used inside async function ✅
- All dependencies explicitly passed ✅
- Returns success/failure boolean ✅
- Input validation included ✅
- Error handling with user feedback ✅

---

### 2. **Fix ContentDetail.tsx - handleCommentReq**

**Before:**

```tsx
const handleCommentReq = async (parentId: number | null) => {
  if (!user) return;
  await handleComment(parentId, content.content_id, commentText); // ❌ Missing params
  onCommentClick(content.comments + 1); // ❌ Always runs, even if comment failed
  setRefreshComments((prev) => !prev);
  setCommentText("");
  setReplyingToCommentId(null);
  setReplyingToComment(null);
};
```

**After:**

```tsx
const handleCommentReq = async (parentId: number | null) => {
  if (!user || !commentText.trim()) {
    showToast("Comment cannot be empty", "", "warning");
    return; // ✅ Early return with feedback
  }

  try {
    // ✅ All parameters passed correctly
    const success = await handleComment(
      parentId,
      content.content_id,
      commentText,
      user.user_id,
      user.area_id || 0,
      updateComment,
      create,
      showToast
    );

    // ✅ Only update UI if comment was actually created
    if (success) {
      onCommentClick(content.comments + 1);
      setRefreshComments((prev) => !prev);
      setCommentText("");
      setReplyingToCommentId(null);
      setReplyingToComment(null);
    }
  } catch (error) {
    console.error("Error submitting comment:", error);
    showToast("Failed to submit comment", "", "error");
  }
};
```

**Fixes:**

- Passes all required parameters ✅
- Checks success before updating UI ✅
- Provides error feedback ✅
- Validates input before submission ✅

---

### 3. **New Logic File: contentDetailLogic.ts**

Created to separate complex business logic from React components:

```
✅ initializeContentState() - State initialization
✅ validateComment() - Input validation
✅ prepareCommentData() - Comment object creation
✅ handlePrevMedia() / handleNextMedia() - Media navigation
✅ handleLikeLogic() - Like/unlike with persistence
✅ handleReportLogic() - Report with persistence
✅ checkIsOwnContent() - Ownership check
✅ updateFollowState() - Follow state toggle
```

**Benefits of Separation:**

1. **Testability** - Pure functions are easy to unit test
2. **Reusability** - Logic can be used in other components
3. **Readability** - Components focus on rendering, logic is isolated
4. **Maintainability** - Changes to business logic don't affect UI structure

---

## 📊 Architecture Comparison

### Before (Poor Practice)

```
ContentDetail.tsx (UI + Logic Mixed)
├── UI Rendering
├── State Management
├── Hook Usage
└── async functions calling hooks ❌

handelComment.tsx (Hooks in Async)
└── Tries to use hooks ❌
```

### After (Best Practice)

```
ContentDetail.tsx (Pure UI)
├── State Management
├── UI Rendering
└── Calls pure logic functions ✅

contentDetailLogic.ts (Pure Logic)
├── Pure functions with no hooks ✅
├── Testable
└── Reusable

handelComment.tsx (Async Utility)
├── Dependency injection ✅
├── No hooks inside async ✅
└── Returns success/failure status ✅
```

---

## 🎯 Summary of Issues Found & Fixed

| Issue                                | Severity    | Cause                    | Fix                           |
| ------------------------------------ | ----------- | ------------------------ | ----------------------------- |
| Hooks in async function              | 🔴 Critical | React rule violation     | Inject dependencies as params |
| Missing function parameters          | 🔴 Critical | Incomplete function call | Pass all required functions   |
| No return value from handleComment   | 🔴 Critical | Can't check if succeeded | Return boolean                |
| No input validation                  | 🟠 High     | Allows empty comments    | Validate before submit        |
| Missing useCommentService hook       | 🔴 Critical | Import missing           | Add import and hook call      |
| Missing updateComment in destructure | 🔴 Critical | Function unavailable     | Add to destructuring          |
| UI updates regardless of success     | 🟠 High     | No success check         | Check return value first      |
| No error feedback to user            | 🟠 High     | Silent failures          | Add try/catch with toast      |

---

## 🚀 Result

✅ Comments now work correctly
✅ Logic is separated from UI
✅ Proper error handling
✅ User feedback on failures
✅ Input validation
✅ Pure functions for testing
✅ No React hook violations
