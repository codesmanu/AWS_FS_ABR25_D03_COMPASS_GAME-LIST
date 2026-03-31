import type { CreateAccount, AccountView, AccountEntity, UpdateAccount } from "@/routes/account/account.types";
import Database from '@/shared/database';

const create = async (accountData: CreateAccount): Promise<AccountView | null> => {
    const account = await Database.account.create({
        data: {
            nickname: accountData.nickname,
            email: accountData.email,
            password: accountData.password,
        },
    });

    if (!account) return null;

    return {
        id: account.id,
        email: account.email,
        nickname: account.nickname,
    };
};

const updateById = async (id: string, accountData: UpdateAccount): Promise<AccountView | null> => {
    const dataToUpdate: Partial<typeof accountData> = {};
    if (accountData.nickname !== undefined) dataToUpdate.nickname = accountData.nickname;
    if (accountData.password !== undefined) dataToUpdate.password = accountData.password;

    if (Object.keys(dataToUpdate).length === 0) return null;

    const updated = await Database.account.update({
        where: { id },
        data: dataToUpdate,
    });

    if (!updated) return null;

    return {
        id: updated.id,
        email: updated.email,
        nickname: updated.nickname,
    };
};

const deleteById = async (id: string): Promise<AccountView | null> => {
    const account = await Database.account.findUnique({ where: { id } });
    if (!account || account.deletedAt) return null;

    const deleted = await Database.account.update({
        where: { id },
        data: { deletedAt: new Date() },
    });

    return {
        id: deleted.id,
        email: deleted.email,
        nickname: deleted.nickname,
    };
};

const activateById = async (id: string): Promise<AccountView | null> => {
    const account = await Database.account.findUnique({ where: { id } });
    if (!account || !account.deletedAt) return null;

    const activated = await Database.account.update({
        where: { id },
        data: { deletedAt: null },
    });

    return {
        id: activated.id,
        email: activated.email,
        nickname: activated.nickname,
    };
};

const findByEmail = async (login: string): Promise<AccountEntity | null> => {
    return Database.account.findUnique({ where: { email: login } });
};

const findById = async (id: string): Promise<AccountEntity | null> => {
    return Database.account.findUnique({ where: { id } });
};

export default {
    create,
    updateById,
    deleteById,
    activateById,
    findByEmail,
    findById,
};