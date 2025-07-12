import jwt from 'jsonwebtoken';
export const generateToken = (owner) => {
    return jwt.sign({ email: owner.email, id: owner._id }, process.env.JWT_KEY);
};