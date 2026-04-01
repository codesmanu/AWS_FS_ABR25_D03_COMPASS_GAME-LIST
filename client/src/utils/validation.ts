export const isValidnickname = (nickname: string): boolean => {
    return !!nickname && nickname.trim().length >= 3;
};

export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !!email && emailRegex.test(email.trim());
};

export const validatePasswordRequirements = (
    password: string,
): { isValid: boolean; messages: string[] } => {
    const messages: string[] = [];

    if (!password || password.length < 8) {
        messages.push('Password must be at least 8 characters long.');
    }

    const rules = [
        {
            regex: /[a-zA-Z]/,
            message: 'Password must contain at least one letter.',
        },
        {
            regex: /\d/,
            message: 'Password must contain at least one number.',
        },
        {
            regex: /[^a-zA-Z0-9]/,
            message: 'Password must contain at least one special character.',
        },
    ];

    rules.forEach((rule) => {
        if (!rule.regex.test(password)) {
            messages.push(rule.message);
        }
    });

    return {
        isValid: messages.length === 0,
        messages,
    };
};
