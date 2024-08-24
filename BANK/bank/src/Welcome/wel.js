import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    const handleFooterClick = () => {
        navigate('/login');
    };

    // 定义内联样式
    const styles = {
        welcomeContainer: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '100vh',
            textAlign: 'center',
            width: '100%',
            margin: '0',
            padding: '0',
            boxSizing: 'border-box',
        },
        photo: {
            width: '100%',
            height: '60%',
            backgroundColor: 'lightgray',
        },
        content: {
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
        },
        contentTitle: {
            fontSize: '2em',
            margin: '20px 0',
            fontWeight: 'bold',
        },
        contentText: {
            fontSize: '1.2em',
            margin: '10px 0',
        },
        footer: {
            width: '100%',
            height: '8%',
            backgroundColor: '#00539f',
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
        },
        footerH1: {
            fontSize: '1em',
            color: 'white',
            margin: '0',
            transition: 'color 0.3s ease',
        },
        footerHover: {
            transform: 'scale(1.05)',
            backgroundColor: '#004080',
        },
        footerH1Hover: {
            color: '#a0e7ff',
        },
    };

    return (
        <div style={styles.welcomeContainer}>
            <div style={styles.photo}></div>
            <div style={styles.content}>
                <h1>Get Started</h1>
                <div style={styles.contentTitle}>Title</div>
                <div style={styles.contentText}>Text</div>
            </div>
            <div
                style={styles.footer}
                onClick={handleFooterClick}
                onMouseOver={(e) => {
                    e.currentTarget.style.transform = styles.footerHover.transform;
                    e.currentTarget.style.backgroundColor = styles.footerHover.backgroundColor;
                    e.currentTarget.querySelector('h1').style.color = styles.footerH1Hover.color;
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.transform = '';
                    e.currentTarget.style.backgroundColor = styles.footer.backgroundColor;
                    e.currentTarget.querySelector('h1').style.color = styles.footerH1.color;
                }}
            >
                <h1 style={styles.footerH1}>Get Started</h1>
            </div>
        </div>
    );
}

export default Home;
