import type { CreateAccountInput, AccountView, Login, UpdateAccount, LoginResponse, DeleteAccountResponse } from "./account.types";
import Repository from '@/routes/account/account.repository';
import Password from '@/shared/password';
import Token from '@/shared/token';

const create = async (input: CreateAccountInput): Promise<AccountView> => {
    const existing = await Repository.findByEmail(input.email);

    if (existing) throw new Error('LOGIN_ALREADY_EXISTS');

    const hashedPassword = await Password.Hash(input.password);
    const account = await Repository.create({
        email: input.email,
        password: hashedPassword,
    });

    if (!account) throw new Error('ACCOUNT_CREATION_FAILED');

    return account;
};

const login = async (input: Login): Promise<LoginResponse> => {
    const account = await Repository.findByEmail(input.email);

    if (!account) throw new Error('INVALID_CREDENTIALS');

    const isValidPassword = await Password.Compare(input.password, account.password);
    if (!isValidPassword) throw new Error('INVALID_CREDENTIALS');

    const token = Token.Generate({
        id: account.id,
        email: account.email,
    });

    const accountView: AccountView = {
        id: account.id,
        email: account.email,
        nickname: account.nickname,
    };

    return {
        token,
        account: accountView,
    };
};

const update = async (id: string, input: UpdateAccount): Promise<AccountView> => {
    const updateData: UpdateAccount = {};

    if (input.nickname !== undefined) updateData.nickname = input.nickname;
    if (input.password !== undefined) updateData.password = await Password.Hash(input.password);

    if (Object.keys(updateData).length === 0) throw new Error('NO_UPDATES_PROVIDED');

    const updatedAccount = await Repository.updateById(id, updateData);
    if (!updatedAccount) throw new Error('ACCOUNT_NOT_FOUND');

    return updatedAccount;
};

const remove = async (id: string): Promise<DeleteAccountResponse> => {
    const account = await Repository.findById(id);
    if (!account) throw new Error('ACCOUNT_NOT_FOUND');

    const deleted = await Repository.deleteById(id);
    if (!deleted) throw new Error('ACCOUNT_NOT_FOUND');

    return {
        id,
        deleted: true,
    };
};

const activate = async (id: string): Promise<AccountView> => {
    const account = await Repository.findById(id);
    if (!account) throw new Error('ACCOUNT_NOT_FOUND');

    const activated = await Repository.activateById(id);
    if (!activated) throw new Error('ACCOUNT_NOT_FOUND_OR_ALREADY_ACTIVE');

    return activated;
};

const refresh = async (id: string): Promise<LoginResponse> => {
    const account = await Repository.findById(id);
    if (!account || account.deletedAt) throw new Error('ACCOUNT_NOT_FOUND');

    const token = Token.Generate({
        id: account.id,
        email: account.email,
    });

    const accountView: AccountView = {
        id: account.id,
        email: account.email,
        nickname: account.nickname,
    };

    return {
        token,
        account: accountView,
    };
};

const check = (token: string) => {
    return Token.Verify(token);
};

export default {
    check,
    create,
    login,
    update,
    remove,
    activate,
    refresh,
};