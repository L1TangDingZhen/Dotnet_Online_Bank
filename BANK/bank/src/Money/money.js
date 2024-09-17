import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
    const [activeTab, setActiveTab] = useState('Everyday');
    const [balance, setBalance] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        // 检查用户是否已登录
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login'); // 如果没有token，则重定向到登录页面
            return;
        }

        // 获取账户余额信息
        axios.get('http://localhost:5128/api/Account/balances', {
            headers: {
                Authorization: token,
            }
        })
        .then(response => {
            const accounts = response.data;
            const everydayAccount = accounts.find(account => account.type === 1); // 查找type为1的账户（Everyday）

            if (everydayAccount) {
                setBalance(everydayAccount.balance); // 设置显示的余额
            }
        })
        .catch(error => {
            console.error('Error fetching account balances:', error);
            // 处理错误，例如重新登录
            navigate('/login');
        });
    }, [navigate]);

    const styles = {
        container: {
            backgroundColor: '#f4f4f4',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            boxSizing: 'border-box',
            padding: 0,
            overflowX: 'hidden',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            marginBottom: '20px',
            boxSizing: 'border-box',
            padding: '10px', // 修改为与 pay.js 一致的 padding
        },
        logo: {
            height: '40px',
        },
        tabContainer: {
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '20px',
            backgroundColor: '#e0e0e0',
            borderRadius: '30px',
            padding: '4px',
            width: 'fit-content',
        },
        slider: {
            position: 'absolute',
            top: '4px',
            left: activeTab === 'Everyday' ? '4px' : 'calc(50% + 4px)',
            width: 'calc(50% - 8px)',
            height: 'calc(100% - 8px)',
            backgroundColor: '#007bff',
            borderRadius: '26px',
            transition: 'left 0.3s ease',
            zIndex: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        tab: {
            padding: '8px 18px',
            borderRadius: '26px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            zIndex: 1,
            color: '#333',
            textAlign: 'center',
            width: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
        },
        tabActive: {
            color: '#fff',
        },
        tabInactive: {
            color: '#333',
        },
        balanceContainer: {
            textAlign: 'center',
            marginBottom: '20px',
            width: '100%',
            boxSizing: 'border-box',
        },
        balance: {
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#000',
        },
        cardContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            width: '90%',
            marginBottom: '20px',
            boxSizing: 'border-box',
        },
        card: {
            flex: 1,
            backgroundColor: '#fff',
            borderRadius: '10px',
            padding: '20px',
            margin: '0 10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            boxSizing: 'border-box',
        },
        transactionContainer: {
            width: '90%',
            backgroundColor: '#fff',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            boxSizing: 'border-box',
            margin: '0 20px',
        },
        footer: {
            display: 'flex',
            justifyContent: 'space-around',
            width: '100%',
            backgroundColor: '#fff',
            padding: '10px 0',
            boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)',
            marginTop: 'auto',
            boxSizing: 'border-box',
        },
        footerItem: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer', // 添加 cursor 样式，表明这是一个可点击的区域
        },
        footerIcon: {
            fontSize: '24px',
            color: '#007bff',
            marginBottom: '5px',
        },
        footerText: {
            fontSize: '12px',
            color: '#007bff',
        },
    };

    // 添加点击处理程序以跳转到不同页面
    const handleFooterClick = (path) => {
        navigate(path);
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>👤</div>
                <div style={styles.headerText}>Dashboard</div>
                <div>🔍</div>
            </div>

            <div style={styles.tabContainer}>
                <span style={styles.slider}></span>
                <div
                    style={activeTab === 'Everyday' ? { ...styles.tab, ...styles.tabActive } : { ...styles.tab, ...styles.tabInactive }}
                    onClick={() => setActiveTab('Everyday')}
                >
                    Everyday
                </div>
                <div
                    style={activeTab === 'Savings' ? { ...styles.tab, ...styles.tabActive } : { ...styles.tab, ...styles.tabInactive }}
                    onClick={() => setActiveTab('Savings')}
                >
                    Savings
                </div>
            </div>

            <div style={styles.balanceContainer}>
                <div>{activeTab === 'Everyday' ? 'Everyday Funds' : 'Savings Funds'}</div>
                <div style={styles.balance}>${balance.toFixed(2)}</div>
            </div>

            <div style={styles.cardContainer}>
                <div style={styles.card}>
                    <div>Spending (30 days)</div>
                    <div>$0</div>
                </div>
                <div style={styles.card}>
                    <div>Last 30 Days</div>
                    <div>Money In & Out</div>
                </div>
            </div>

            <div style={styles.transactionContainer}>
                {/* 其他内容 */}
            </div>

            <div style={styles.footer}>
                <div style={styles.footerItem} onClick={() => handleFooterClick('/money')}>
                    <div style={styles.footerIcon}>💵</div>
                    <div style={styles.footerText}>Money</div>
                </div>
                <div style={styles.footerItem} onClick={() => handleFooterClick('/payments')}>
                    <div style={styles.footerIcon}>💳</div>
                    <div style={styles.footerText}>Payments</div>
                </div>
                <div style={styles.footerItem} onClick={() => handleFooterClick('/payments')}>
                    <div style={styles.footerIcon}>💳</div>
                    <div style={styles.footerText}>Card</div>
                </div>
                <div style={styles.footerItem} onClick={() => handleFooterClick('/payments')}>
                    <div style={styles.footerIcon}>📞</div>
                    <div style={styles.footerText}>Support</div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
