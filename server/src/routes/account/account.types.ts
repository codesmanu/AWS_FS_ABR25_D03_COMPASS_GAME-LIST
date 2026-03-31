import { Account } from "@prisma/client";

export type AccountEntity = Account;
export type AccountView = Omit<Account, 'password' | 'deletedAt' | 'createdAt' | 'updatedAt'>;
export type CreateAccount = Pick<Account, 'email' | 'password' | 'nickname'>;
export type Login = Pick<Account, 'email' | 'password'>;
export type UpdateAccount = Partial<Pick<Account, 'nickname' | 'password'>>;
export type LoginResponse = { token: string; account: AccountView };
export type DeleteAccountResponse = { id: string; deleted: boolean };