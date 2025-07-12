import mongoose from 'mongoose';

const ownerSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { timestamps: true });

const Owner = mongoose.model('Owner', ownerSchema);
export default Owner;
