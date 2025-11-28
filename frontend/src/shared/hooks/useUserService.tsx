import { UserService } from "../../service/api/services/UserService";
import type { CreateUserDto } from "../../service/api/models/CreateUserDto";
import type { Ack } from "../../service/api/models/Ack";
import useApiCall from "./useApiCall";

export default function useUserService() {
  const { call, data, loading, error } = useApiCall();
  const create = (dto: CreateUserDto) =>
    call<Ack>(() => UserService.userControllerCreate(dto));

  const findUserById = (userId: number) =>
    call(() => UserService.userControllerFindOne(userId));

  return { create, findUserById, result: data, loading, error };
}
