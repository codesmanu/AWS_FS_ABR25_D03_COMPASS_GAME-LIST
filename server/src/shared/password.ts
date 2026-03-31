import bcrypt from 'bcryptjs';

const Hash = async (password: string): Promise<string> => {
    try {
        const salt = await bcrypt.genSalt(8);
        return await bcrypt.hash(password, salt);
    } catch (err) {
        throw new Error('Erro ao gerar o hash da senha');
    }
};

const Compare = async (password: string, hashedPassword: string): Promise<boolean> => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        throw new Error('Erro ao comparar a senha');
    }
};

export default { Hash, Compare };
