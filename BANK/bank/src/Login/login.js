import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5128/api/Account/login', {
                name: username,
                password: password
            });

            if (response.status === 200) {
                alert('Login successful');
                // 假设返回的响应中有一个 token，存储在 localStorage 中
                localStorage.setItem('token', response.data.token);
                navigate('/money'); // 登陆成功后跳转到 money 页面
            }
        } catch (error) {
            console.error('There was an error logging in!', error);
            alert('Login failed');
        }
    };

    const handleRegister = () => {
        navigate('/register');
    };

    const styles = {
        container: {
            backgroundColor: '#ffffff',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            width: '100%',
            maxWidth: '400px',         // 限制最大宽度
            margin: 'auto',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxSizing: 'border-box',
        },
        h1: {
            color: '#333333',
            fontSize: '2rem',
            marginBottom: '20px',
        },
        form: {
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        formGroup: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px',
            width: '100%',
            maxWidth: '350px',         // 控制输入框和按钮的最大宽度
        },
        label: {
            color: '#555555',
            fontWeight: 'bold',
            fontSize: '1rem',
            flex: '0 0 25%',           // 缩小 label 的宽度
            textAlign: 'left',         // 靠左对齐 label
        },
        input: {
            padding: '10px',
            border: '1px solid #dddddd',
            borderRadius: '5px',
            fontSize: '1rem',
            width: '70%',              // 增加 input 的宽度
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
            width: '70%',
            textAlign: 'center',
            marginBottom: '15px',
            maxWidth: '350px',
        },
        buttonHover: {
            backgroundColor: '#004080',
        },
        registerLink: {
            color: '#00539f',
            cursor: 'pointer',
            fontSize: '1rem',
            textAlign: 'center',
            marginTop: '15px',
            textDecoration: 'underline',
        },
    };
    
    return (
        <div style={styles.container}>
            <h1 style={styles.h1}>Login</h1>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <button
                    type="submit"
                    style={styles.button}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor)}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = styles.button.backgroundColor)}
                >
                    Login
                </button>
                <div
                    style={styles.registerLink}
                    onClick={handleRegister}
                >
                    Register
                </div>
            </form>
        </div>
    );
    
    


    return (
        <div style={styles.container}>
            <h1 style={styles.h1}>Login</h1>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <button
                    type="submit"
                    style={styles.button}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor)}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = styles.button.backgroundColor)}
                >
                    Login
                </button>
                <div
                    style={styles.registerLink}
                    onClick={handleRegister}
                >
                    Register
                </div>
            </form>
        </div>
    );
}

export default Home;
