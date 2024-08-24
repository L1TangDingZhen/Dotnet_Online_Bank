import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Payments() {
    const [showAccountDetails, setShowAccountDetails] = useState(false);
    const [showDepositDetails, setShowDepositDetails] = useState(false);
    const [showPinEntry, setShowPinEntry] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [bsb, setBsb] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [pin, setPin] = useState('');
    const [amount, setAmount] = useState('');
    const [animatePinEntry, setAnimatePinEntry] = useState(false);
    const [depositAmount, setDepositAmount] = useState('');
    const [showDepositPinEntry, setShowDepositPinEntry] = useState(false);
    const [depositPin, setDepositPin] = useState('');

    const depositAmountRef = useRef(null);
    const navigate = useNavigate();

    const isContinueEnabled = bsb.replace(/\s+/g, '').length === 6 && accountNumber.replace(/\s+/g, '').length === 9;


    const handleBsbChange = (e) => {
        const formattedValue = e.target.value.replace(/\D/g, '').replace(/(\d{3})(?=\d)/g, '$1 ');
        setBsb(formattedValue);
    };

    const handleAccountNumberChange = (e) => {
        const formattedValue = e.target.value.replace(/\D/g, '').replace(/(\d{3})(?=\d)/g, '$1 ');
        setAccountNumber(formattedValue);
    };

    const handleAmountChange = (e) => {
        setAmount(e.target.value);
    };

    const handleContinueClick = () => {
        if (isContinueEnabled) {
            setShowConfirmation(true);
            setShowAccountDetails(false);
        }
    };

    const handleConfirmClick = () => {
        setShowConfirmation(false);
        setAnimatePinEntry(true);
        setTimeout(() => setShowPinEntry(true), 300);
    };

    const handlePinInput = (num) => {
        if (pin.length < 6) {
            const newPin = pin + num;
            setPin(newPin);
            if (newPin.length === 6) {
                handlePayClick(newPin);
            }
        }
    };

    const handleDelete = () => {
        setPin((prevPin) => prevPin.slice(0, -1));
    };

    const handleCancel = () => {
        setAnimatePinEntry(false);
        setTimeout(() => setShowPinEntry(false), 300);
    };

    const handleFooterClick = (path) => {
        navigate(path);
    };

    const handlePayClick = async (enteredPin) => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:5128/api/TransferRequest/create',
                {
                    BSB: bsb.replace(/\s+/g, ''), 
                    AccountNumber: accountNumber.replace(/\s+/g, ''), 
                    Amount: parseFloat(amount),
                    Pin: enteredPin,
                },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );

            if (response.status === 200) {
                alert('Transfer request created successfully!');
                // 重置所有状态
                setBsb('');
                setAccountNumber('');
                setAmount('');
                setPin('');
                setShowPinEntry(false);
                setAnimatePinEntry(false);
                setShowConfirmation(false);
            }
        } catch (error) {
            console.error('Error creating transfer request:', error);
            alert('Failed to create transfer request. Please check your inputs and try again.');
        } finally {
            setPin(''); 
            setShowPinEntry(false);
            setAnimatePinEntry(false); 
        }
    };

    function ConfirmationScreen() {
        return (
            <div style={styles.confirmationContainer}>
                <div style={styles.accountDetailsHeader}>
                    <div style={styles.backButton} onClick={() => {
                        setShowConfirmation(false);
                        setShowAccountDetails(true);
                    }}>←</div>
                    <div style={styles.accountDetailsTitle}>Confirm Payment</div>
                </div>
                <div style={styles.confirmationDetails}>
                    <p><strong>BSB:</strong> {bsb}</p>
                    <p><strong>Account Number:</strong> {accountNumber}</p>
                    <p><strong>Amount:</strong> ${amount}</p>
                </div>
                <div style={styles.continueButton} onClick={handleConfirmClick}>
                    Confirm and Enter PIN
                </div>
            </div>
        );
    }

    const handleDepositAmountChange = (e) => {
        const value = e.target.value;
        const regex = /^\d*\.?\d{0,2}$/;
        if (regex.test(value) || value === '') {
            setDepositAmount(value);
        }
    };

    const handleDepositClick = () => {
        setShowDepositDetails(true);
        setShowAccountDetails(false);
        setShowPinEntry(false);
        setShowDepositPinEntry(false);
        setTimeout(() => {
            if (depositAmountRef.current) {
                depositAmountRef.current.focus();
            }
        }, 0);
    };

    const handleDepositContinue = () => {
        if (depositAmount && parseFloat(depositAmount) > 0) {
            setShowDepositPinEntry(true);
            setShowDepositDetails(false);
        } else {
            alert('Please enter a valid amount.');
        }
    };

    const handleDepositPinInput = (num) => {
        if (depositPin.length < 6) {
            const newPin = depositPin + num;
            setDepositPin(newPin);
            if (newPin.length === 6) {
                handleDepositSubmit(newPin);
            }
        }
    };


    const handleDepositPinDelete = () => {
        setDepositPin((prevPin) => prevPin.slice(0, -1));
    };



    const handleDepositPinCancel = () => {
        setShowDepositPinEntry(false);
        setDepositPin('');
        setShowDepositDetails(true);
    };

    const handleDepositSubmit = async (enteredPin) => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:5128/api/TransferRequest/deposit',
                {
                    Amount: parseFloat(depositAmount),
                    Pin: enteredPin,
                },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );

            if (response.status === 200) {
                alert('Deposit successful!');
                setShowDepositPinEntry(false);
                setDepositPin('');
                setDepositAmount('');
                setShowDepositDetails(false);
            }
        } catch (error) {
            console.error('Error during deposit:', error);
            alert('Failed to make deposit. Please try again.');
        }
    };

    function DepositDetails() {
        return (
            <div style={styles.depositDetailsContainer}>
                <div style={styles.accountDetailsHeader}>
                    <div style={styles.backButton} onClick={() => setShowDepositDetails(false)}>←</div>
                    <div style={styles.accountDetailsTitle}>Deposit Amount</div>
                </div>
                <div style={styles.formGroup}>
                    <div style={styles.formLabel}>Amount</div>
                    <input 
                        type="text" 
                        style={styles.formInput} 
                        value={depositAmount} 
                        onChange={handleDepositAmountChange} 
                        ref={depositAmountRef}
                    />
                </div>
                <div
                    style={{
                        ...styles.continueButton, 
                        backgroundColor: depositAmount && parseFloat(depositAmount) > 0 ? '#007bff' : '#e0e0e0',
                        cursor: depositAmount && parseFloat(depositAmount) > 0 ? 'pointer' : 'not-allowed'
                    }}
                    onClick={depositAmount && parseFloat(depositAmount) > 0 ? handleDepositContinue : undefined}
                >
                    Continue
                </div>
            </div>
        );
    }



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
            padding: '10px',
        },

        confirmationContainer: {
            position: 'fixed',
            bottom: '0',
            left: 0,
            width: '100%',
            height: '80%',
            backgroundColor: '#fff',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)',
            transition: 'bottom 0.3s ease',
            padding: '20px',
            zIndex: 1000,
        },
        confirmationDetails: {
            marginTop: '20px',
            fontSize: '18px',
        },

        depositDetailsContainer: {
            position: 'fixed',
            bottom: '0',
            left: 0,
            width: '100%',
            height: '80%',
            backgroundColor: '#fff',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)',
            transition: 'bottom 0.3s ease',
            padding: '20px',
            zIndex: 1000,
        },
        headerText: {
            fontSize: '24px',
            fontWeight: 'bold',
        },
        quickActionsContainer: {
            display: 'flex',
            justifyContent: 'space-around',
            width: '60%',
            marginBottom: '20px',
        },
        quickActionButton: {
            backgroundColor: '#007bff',
            color: '#fff',
            padding: '15px 30px',
            borderRadius: '25px',
            textAlign: 'center',
            fontSize: '18px',
            cursor: 'pointer',
            flex: 1,
            margin: '0 10px',
        },
        quickPayContainer: {
            width: '90%',
            marginBottom: '20px',
        },
        quickPayHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
        },
        quickPayHeader1: {
            fontSize: '25px',
            fontWeight: 'bold',
        },
        quickPayHeader2: {
            fontSize: '19px',
            color: '#007bff',
            cursor: 'pointer',
        },
        quickPayItems: {
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
        },
        quickPayItem: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
        },
        quickPayIcon: {
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#ADD8E6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0066CC',
            fontSize: '24px',
            marginBottom: '5px',
        },
        scheduledContainer: {
            width: '90%',
            backgroundColor: '#fff',
            borderRadius: '10px',
            padding: '15px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        failedContainer: {
            width: '90%',
            backgroundColor: '#fff',
            borderRadius: '10px',
            padding: '15px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            marginBottom: '20px',
            borderLeft: '5px solid red',
        },
        transactionList: {
            width: '90%',
            backgroundColor: '#fff',
            borderRadius: '10px',
            padding: '15px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            marginBottom: '20px',
            boxSizing: 'border-box',
            margin: '0 20px',
        },
        transactionItem: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px',
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
            fontSize: '12px',
            cursor: 'pointer',
        },
        footerIcon: {
            fontSize: '24px',
            color: '#007bff',
            marginBottom: '5px',
        },
        accountDetailsContainer: {
            position: 'fixed',
            bottom: showAccountDetails || showDepositDetails ? '0' : '-100%',
            left: 0,
            width: '100%',
            height: '80%',
            backgroundColor: '#fff',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)',
            transition: 'bottom 0.3s ease',
            padding: '20px',
            zIndex: 1000,
        },
        accountDepositContainer: {
            position: 'fixed',
            bottom: showAccountDetails ? '0' : '-100%',
            left: 0,
            width: '100%',
            height: '80%',
            backgroundColor: '#fff',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)',
            transition: 'bottom 0.3s ease',
            padding: '20px',
            zIndex: 1000,
        },
        accountDetailsHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
        },
        backButton: {
            fontSize: '24px',
            color: '#007bff',
            cursor: 'pointer',
            flexShrink: 0,
            marginRight: '10px',
        },
        accountDetailsTitle: {
            fontSize: '20px',
            fontWeight: 'bold',
            textAlign: 'center',
            flex: 1,
        },
        formGroup: {
            marginBottom: '15px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
        },
        formLabel: {
            marginBottom: '5px',
            fontSize: '16px',
            fontWeight: 'bold',
        },
        formInput: {
            width: 'calc(100% - 40px)',
            padding: '10px',
            fontSize: '16px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            boxSizing: 'border-box',
        },
        formNote: {
            fontSize: '12px',
            color: '#999',
            marginTop: '5px',
        },
        continueButton: {
            width: '30%',
            padding: '15px',
            borderRadius: '25px',
            backgroundColor: isContinueEnabled ? '#007bff' : '#e0e0e0',
            textAlign: 'center',
            fontSize: '18px',
            color: isContinueEnabled ? '#fff' : '#999',
            cursor: isContinueEnabled ? 'pointer' : 'not-allowed',
            marginTop: '20px',
            marginLeft: 'auto',
            marginRight: 'auto',
            display: 'block',
        },
    };

    function PinEntry() {
        const styles = {
            container: {
                backgroundColor: '#dcdcdc',
                height: '60vh',
                width: '100vw',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '20px 20px 0 0',
                padding: '20px',
                position: 'fixed',
                bottom: animatePinEntry ? '0' : '-100%',
                left: '0',
                transition: 'bottom 0.3s ease',
            },
            header: {
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '30px',
            },
            pinDots: {
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '30px',
            },
            dot: (isActive) => ({
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: isActive ? '#007bff' : '#000',
                margin: '0 5px',
            }),
            keypad: {
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '15px',
            },
            key: {
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#e0e0e0',
                borderRadius: '50%',
                fontSize: '18px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
            },
            keyActive: {
                backgroundColor: '#cccccc',
            },
            footer: {
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                marginTop: '20px',
            },
            footerButton: {
                fontSize: '16px',
                color: '#007bff',
                cursor: 'pointer',
                textAlign: 'center',
                width: '33%',
            },
        };

        const [activeKey, setActiveKey] = useState(null);

        const handleKeyClick = (num) => {
            setActiveKey(num);
            handlePinInput(num);
            setTimeout(() => setActiveKey(null), 150);
        };

        return (
            <div style={styles.container}>
                <div style={styles.header}>Enter Your Access PIN</div>
                <div style={styles.pinDots}>
                    {[...Array(6)].map((_, index) => (
                        <div key={index} style={styles.dot(index < pin.length)}></div>
                    ))}
                </div>
                <div style={styles.keypad}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <div
                            key={num}
                            style={{
                                ...styles.key,
                                ...(activeKey === num ? styles.keyActive : {}),
                            }}
                            onClick={() => handleKeyClick(num)}
                        >
                            {num}
                        </div>
                    ))}
                    <div style={{ gridColumn: '2 / 3' }}>
                        <div
                            style={{
                                ...styles.key,
                                ...(activeKey === 0 ? styles.keyActive : {}),
                            }}
                            onClick={() => handleKeyClick(0)}
                        >
                            0
                        </div>
                    </div>
                    <div style={{ gridColumn: '3 / 4' }}>
                        <div
                            style={{
                                ...styles.key,
                                ...(activeKey === 'delete' ? styles.keyActive : {}),
                            }}
                            onClick={handleDelete}
                        >
                            ⌫
                        </div>
                    </div>
                </div>
                <div style={styles.footer}>
                    <div style={styles.footerButton}>Forgot PIN</div>
                    <div style={{ width: '33%' }}></div>
                    <div style={styles.footerButton} onClick={handleCancel}>Cancel</div>
                </div>
            </div>
        );
    }

    function DepositDetails({ navigate, setShowDepositDetails }) {
        React.useEffect(() => {
            if (depositAmountRef.current) {
                depositAmountRef.current.focus();
            }
        }, []);
    
        const handleExit = () => {
            setShowDepositDetails(false);
            setDepositAmount('');
        };
    
        const isAmountValid = depositAmount && parseFloat(depositAmount) > 0;
    
        const buttonStyle = {
            ...styles.continueButton,
            backgroundColor: isAmountValid ? '#007bff' : '#e0e0e0',
            color: isAmountValid ? '#fff' : '#999',
            cursor: isAmountValid ? 'pointer' : 'not-allowed',
        };
    
        return (
            <div style={styles.depositDetailsContainer}>
                <div style={styles.accountDetailsHeader}>
                    <div style={styles.backButton} onClick={handleExit}>←</div>
                    <div style={styles.accountDetailsTitle}>Deposit Amount</div>
                </div>
                <div style={styles.formGroup}>
                    <div style={styles.formLabel}>Amount</div>
                    <input 
                        type="text" 
                        style={styles.formInput} 
                        value={depositAmount} 
                        onChange={handleDepositAmountChange} 
                        ref={depositAmountRef}
                    />
                </div>
                <div
                    style={buttonStyle}
                    onClick={isAmountValid ? handleDepositContinue : undefined}
                >
                    Continue
                </div>
            </div>
        );
    }

    function DepositPinEntry() {
        const styles = {
            container: {
                backgroundColor: '#dcdcdc',
                height: '60vh',
                width: '100vw',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '20px 20px 0 0',
                padding: '20px',
                position: 'fixed',
                bottom: '0',
                left: '0',
                transition: 'bottom 0.3s ease',
            },
            header: {
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '30px',
            },
            pinDots: {
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '30px',
            },
            dot: {
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#000',
                margin: '0 5px',
            },
            activeDot: {
                backgroundColor: '#007bff',
            },
            keypad: {
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '15px',
            },
            key: {
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#e0e0e0',
                borderRadius: '50%',
                fontSize: '18px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
            },
            keyActive: {
                backgroundColor: '#cccccc',
            },
            footer: {
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                marginTop: '20px',
            },
            footerButton: {
                fontSize: '16px',
                color: '#007bff',
                cursor: 'pointer',
                textAlign: 'center',
                width: '33%',
            },
        };

        
        const [activeKey, setActiveKey] = useState(null);

        const handleKeyClick = (num) => {
            setActiveKey(num);
            handleDepositPinInput(num);
            setTimeout(() => setActiveKey(null), 150);
        };

        return (
            <div style={styles.container}>
                <div style={styles.header}>Enter Your Deposit PIN</div>
                <div style={styles.pinDots}>
                    {[...Array(6)].map((_, index) => (
                        <div 
                            key={index} 
                            style={{
                                ...styles.dot,
                                ...(index < depositPin.length ? styles.activeDot : {})
                            }}
                        ></div>
                    ))}
                </div>
                <div style={styles.keypad}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <div
                            key={num}
                            style={{
                                ...styles.key,
                                ...(activeKey === num ? styles.keyActive : {}),
                            }}
                            onClick={() => handleKeyClick(num)}
                        >
                            {num}
                        </div>
                    ))}
                    <div style={{ gridColumn: '2 / 3' }}>
                        <div
                            style={{
                                ...styles.key,
                                ...(activeKey === 0 ? styles.keyActive : {}),
                            }}
                            onClick={() => handleKeyClick(0)}
                        >
                            0
                        </div>
                    </div>
                    <div style={{ gridColumn: '3 / 4' }}>
                        <div
                            style={{
                                ...styles.key,
                                ...(activeKey === 'delete' ? styles.keyActive : {}),
                            }}
                            onClick={handleDepositPinDelete}
                        >
                            ⌫
                        </div>
                    </div>
                </div>
                <div style={styles.footer}>
                    <div style={styles.footerButton}>Forgot PIN</div>
                    <div style={{ width: '33%' }}></div>
                    <div style={styles.footerButton} onClick={handleDepositPinCancel}>Cancel</div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>👤</div>
                <div style={styles.headerText}>Payments</div>
                <div>🔍</div>
            </div>

            <div style={styles.quickActionsContainer}>
                <div style={styles.quickActionButton} onClick={() => setShowAccountDetails(true)}>💲 Pay</div>
                <div style={styles.quickActionButton}>🔄 Transfer</div>
                <div style={styles.quickActionButton} onClick={() => setShowDepositDetails(true)}>🏧 Deposit</div>
            </div>

            {showPinEntry ? (
                <PinEntry />
            ) : showAccountDetails ? (
                <div style={styles.accountDetailsContainer}>
                    <div style={styles.accountDetailsHeader}>
                        <div style={styles.backButton} onClick={() => setShowAccountDetails(false)}>←</div>
                        <div style={styles.accountDetailsTitle}>Account Details</div>
                    </div>

                    <div style={styles.formGroup}>
                        <div style={styles.formLabel}>BSB</div>
                        <input type="text" style={styles.formInput} value={bsb} onChange={handleBsbChange} />
                    </div>
                    <div style={styles.formGroup}>
                        <div style={styles.formLabel}>Account Number</div>
                        <input type="text" style={styles.formInput} value={accountNumber} onChange={handleAccountNumberChange} />
                    </div>
                    <div style={styles.formGroup}>
                        <div style={styles.formLabel}>Amount</div>
                        <input type="text" style={styles.formInput} value={amount} onChange={handleAmountChange} />
                    </div>
                    <div style={styles.formGroup}>
                        <div style={styles.formLabel}>Account Name</div>
                        <input type="text" style={styles.formInput} />
                        <div style={styles.formNote}>Account name won't be matched, verified or checked with the BSB and account number.</div>
                    </div>

                    <div
                        style={styles.continueButton}
                        onClick={handleContinueClick}
                    >
                        Continue
                    </div>
                </div>
            ) : showConfirmation ? (
                <ConfirmationScreen />
            ) : showDepositDetails ? (
                <DepositDetails 
                    navigate={navigate} 
                    setShowDepositDetails={setShowDepositDetails} 
                />
            ) : showDepositPinEntry ? (
                <DepositPinEntry />
            ) : null}

            <div style={styles.footer}>
                <div style={styles.footerItem} onClick={() => handleFooterClick('/money')}>
                    <div style={styles.footerIcon}>💵</div>
                    <div style={styles.footerText}>Money</div>
                </div>
                <div style={styles.footerItem} onClick={() => handleFooterClick('/payments')}>
                    <div style={styles.footerIcon}>💳</div>
                    <div style={styles.footerText}>Payments</div>
                </div>
                <div style={styles.footerItem} onClick={() => handleFooterClick('/card')}>
                    <div style={styles.footerIcon}>💳</div>
                    <div style={styles.footerText}>Card</div>
                </div>
                <div style={styles.footerItem} onClick={() => handleFooterClick('/support')}>
                    <div style={styles.footerIcon}>📞</div>
                    <div style={styles.footerText}>Support</div>
                </div>
            </div>
        </div>
    );
}

export default Payments;
