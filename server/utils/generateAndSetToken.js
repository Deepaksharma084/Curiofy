import jwt from 'jsonwebtoken';

export const generateAndSetToken = (owner, res) => {
    const token = jwt.sign(
        { email: owner.email, id: owner._id },
        process.env.JWT_KEY
    );

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000,
        path: '/',
    });

    return token;
};
