export default function UserNotFoundPage() {
  return (
    <div className="min-h-screen w-full fixed inset-0 flex items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <div className="text-8xl font-bold text-primary opacity-80">404</div>
          <h1 className="text-4xl font-bold text-foreground">User Not Found</h1>
        </div>

        <div className="w-32 h-32 mx-auto bg-card rounded-full flex items-center justify-center border-2 border-primary/20">
          <svg
            className="w-16 h-16 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <p className="text-lg text-foreground/70 max-w-md">
          The user you're looking for doesn't exist. They may have changed their
          username or deleted their account.
        </p>
      </div>
    </div>
  );
}
