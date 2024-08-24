import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // 引入 useNavigate

function Register() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [pin, setPin] = useState('');
    const navigate = useNavigate(); // 初始化 useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();

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
        },
        buttonHover: {
            backgroundColor: '#004080',
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
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Transaction PIN:</label>
                    <input
                        type="password"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
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
                    Register
                </button>
            </form>
        </div>
    );
}

export default Register;
