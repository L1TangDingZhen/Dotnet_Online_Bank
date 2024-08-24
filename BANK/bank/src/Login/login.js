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
            padding: '2vw',
            borderRadius: '1vw',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            width: '50vw',
            maxWidth: '20vm',
            margin: 'auto',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxSizing: 'border-box',
        },
        h1: {
            color: '#333333',
            fontSize: '4vw',
            marginBottom: '3vh',
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
            marginBottom: '2vh',
            width: '100%',
        },
        label: {
            color: '#555555',
            fontWeight: 'bold',
            marginRight: '1vw',
            fontSize: '3vw',
            flex: '0 0 25%',
            marginLeft: '5%',
            textAlign: 'right',
        },
        input: {
            padding: '1vw',
            border: '1px solid #dddddd',
            borderRadius: '0.5vw',
            fontSize: '3vw',
            transition: 'border-color 0.3s ease',
            width: 'calc(70% - 2vw)',
            marginRight: '5%',
            boxSizing: 'border-box',
        },
        inputFocus: {
            borderColor: '#00539f',
            outline: 'none',
        },
        button: {
            backgroundColor: '#00539f',
            color: 'white',
            padding: '1.5vw',
            border: 'none',
            borderRadius: '0.5vw',
            cursor: 'pointer',
            fontSize: '3vw',
            transition: 'background-color 0.3s ease',
            width: '100%',
            textAlign: 'center',
            marginBottom: '2vh',
        },
        buttonHover: {
            backgroundColor: '#004080',
        },
        registerLink: {
            color: '#00539f',
            cursor: 'pointer',
            fontSize: '2.5vw',
            textAlign: 'center',
            marginTop: '2vh',
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
}

export default Home;
