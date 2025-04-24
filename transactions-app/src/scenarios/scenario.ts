import axios from 'axios';

const API_URL = 'http://localhost:3000/api/transfer';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc0NDIxNzQyOX0.K1c6iyeGL6vU8ePQhnE8SeSIAOuIoZoQ4vzO2A2sa9g';

const transfer = async (amount: number) => {
    try {
        const res = await axios.post(API_URL, {
            fromAccount: 2,
            toAccount: 3,
            amount,
            isolationLevel: 'READ COMMITTED'
        }, {
            headers: { Authorization: `Bearer ${TOKEN}` }
        });
        console.log('Success:', res.data);
    } catch (err: any) {
        console.error('Error:', err.response?.data || err.message);
    }
};

const main = async () => {
    await Promise.all([
        transfer(500),
        transfer(500)
    ]);
};

main();
