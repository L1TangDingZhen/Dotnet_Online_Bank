import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // 引入 useNavigate

function Register() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [pin, setPin] = useState('');
    const [passwordMismatch, setPasswordMismatch] = useState(false);
    const [pinError, setPinError] = useState(false); // 新增 PIN 错误状态
    const navigate = useNavigate(); // 初始化 useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 检查两次密码是否一致
        if (password !== confirmPassword) {
            setPasswordMismatch(true);
            return;
        }

        // 检查 PIN 是否为6位数字
        const pinPattern = /^\d{6}$/; // 正则表达式检查6位数字
        if (!pinPattern.test(pin)) {
            setPinError(true);
            return;
        }

        setPasswordMismatch(false);
        setPinError(false);

        try {
            const response = await axios.post('http://localhost:5128/api/Account/register', {
                name: name,
                password: password,
                pin: pin
            });

            alert('Registration successful');
            navigate('/login'); // 注册成功后跳转到登录页面
        } catch (error) {
            console.error('There was an error registering!', error);
            alert('Registration failed');
        }
    };

    // 监听 PIN 的变化，只允许输入数字，最大长度为6
    const handlePinChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) && value.length <= 6) {
            setPin(value);
        }
    };

    // 监听密码变化
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (e.target.value !== confirmPassword) {
            setPasswordMismatch(true);
        } else {
            setPasswordMismatch(false);
        }
    };

    // 监听确认密码的变化
    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        if (e.target.value !== password) {
            setPasswordMismatch(true);
        } else {
            setPasswordMismatch(false);
        }
    };

    const styles = {
        container: {
            backgroundColor: '#ffffff',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            width: '100%',
            maxWidth: '400px',  // 最大宽度设置为400px
            margin: 'auto',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxSizing: 'border-box',
        },
        h1: {
            color: '#333333',
            fontSize: '2rem', // 使用rem来设置字体大小
            marginBottom: '20px',
            textAlign: 'center',
        },
        form: {
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
        },
        formGroup: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px',
            width: '100%',
        },
        label: {
            color: '#555555',
            fontWeight: 'bold',
            fontSize: '1rem',
            flex: '0 0 28%',  // 标签占用容器的28%宽度
            textAlign: 'right',
        },
        input: {
            padding: '10px',
            border: '1px solid #dddddd',
            borderRadius: '5px',
            fontSize: '1rem',
            width: '67%',  // 输入框占用67%宽度，保持与label的整体对齐
            boxSizing: 'border-box',
        },
        button: {
            backgroundColor: '#00539f',
            color: 'white',
            padding: '12px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'background-color 0.3s ease',
            width: '100%',
            textAlign: 'center',
            marginBottom: '15px',
        },
        buttonHover: {
            backgroundColor: '#004080',
        },
        errorText: {
            color: 'red',
            fontSize: '0.9rem',
            marginTop: '-10px',
            marginBottom: '10px',
            textAlign: 'center',
        },
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.h1}>Register</h1>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Username:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange} // 实时监听密码输入
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Confirm Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange} // 实时监听确认密码
                        required
                        style={styles.input}
                    />
                </div>
                {passwordMismatch && (
                    <div style={styles.errorText}>Passwords do not match</div>
                )}
                <div style={styles.formGroup}>
                    <label style={styles.label}>Transaction PIN:</label>
                    <input
                        type="password"
                        value={pin}
                        onChange={handlePinChange} // 使用新的 handlePinChange 函数
                        required
                        style={styles.input}
                    />
                </div>
                {pinError && (
                    <div style={styles.errorText}>Transaction PIN must be 6 digits</div>
                )}
                <button
                    type="submit"
                    style={styles.button}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor)}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = styles.button.backgroundColor)}
                >
                    Register
                </button>
            </form>
        </div>
    );
}

export default Register;
