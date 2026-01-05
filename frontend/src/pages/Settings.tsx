import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { User, Lock, Trash2, Save, AlertTriangle } from 'lucide-react';

export const Settings = () => {
    const { user, login } = useAuth(); // login behaves like 'updateUser' if we pass new data
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [currPassword, setCurrPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    const updateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const res = await axios.put('http://localhost:5000/api/auth/profile', 
                { name, email },
                { headers: { Authorization: `Bearer ${user?.token}` } }
            );
            // Update local user state
            login(res.data); 
            setMessage({ type: 'success', text: 'Profile updated successfully' });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' });
        } finally {
            setLoading(false);
        }
    };

    const updatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            await axios.put('http://localhost:5000/api/auth/password', 
                { currPassword, newPassword },
                { headers: { Authorization: `Bearer ${user?.token}` } }
            );
            setMessage({ type: 'success', text: 'Password updated successfully' });
            setCurrPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Password update failed' });
        } finally {
            setLoading(false);
        }
    };

    const deleteAccount = async () => {
        if (!confirm("Are you ABSOLUTELY sure? This action cannot be undone. All your data will be permanently lost.")) return;
        
        try {
            await axios.delete('http://localhost:5000/api/auth/account', {
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            alert("Account deleted.");
            // Force logout / redirect handled by AuthContext if user is null, but we should manually cleanup
            localStorage.removeItem('user');
            window.location.href = '/login';
        } catch (err: any) {
             alert(err.response?.data?.message || "Delete failed");
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">Settings</h2>
            
            {message.text && (
                <div className={`p-4 rounded-lg flex items-center gap-2 ${message.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                    {message.type === 'error' ? <AlertTriangle size={20} /> : <Save size={20} />}
                    {message.text}
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
                {/* Profile Settings */}
                <Card className="p-6">
                    <div className="flex items-center gap-2 mb-6 text-primary">
                        <User size={24} />
                        <h3 className="text-xl font-bold text-white">Profile Information</h3>
                    </div>
                    <form onSubmit={updateProfile} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                            <input 
                                type="text" 
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/50 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/50 text-white"
                            />
                        </div>
                        <Button type="submit" isLoading={loading} className="w-full">
                            Update Profile
                        </Button>
                    </form>
                </Card>

                {/* Password Settings */}
                <Card className="p-6">
                    <div className="flex items-center gap-2 mb-6 text-primary">
                        <Lock size={24} />
                        <h3 className="text-xl font-bold text-white">Security</h3>
                    </div>
                    <form onSubmit={updatePassword} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Current Password</label>
                            <input 
                                type="password" 
                                value={currPassword}
                                onChange={e => setCurrPassword(e.target.value)}
                                className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/50 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">New Password</label>
                            <input 
                                type="password" 
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/50 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Confirm New Password</label>
                            <input 
                                type="password" 
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/50 text-white"
                            />
                        </div>
                        <Button type="submit" isLoading={loading} variant="outline" className="w-full">
                            Change Password
                        </Button>
                    </form>
                </Card>
            </div>

            {/* Danger Zone */}
            <Card className="p-6 border-red-500/20 bg-red-500/5">
                <div className="flex items-center gap-2 mb-4 text-red-500">
                    <AlertTriangle size={24} />
                    <h3 className="text-xl font-bold">Danger Zone</h3>
                </div>
                <p className="text-gray-400 mb-6">
                    Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button onClick={deleteAccount} variant="outline" className="text-red-500 border-red-500/50 hover:bg-red-500/10 w-full md:w-auto">
                    <Trash2 size={18} className="mr-2" /> Delete Account
                </Button>
            </Card>
        </div>
    );
};
