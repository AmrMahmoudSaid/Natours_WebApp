import '@babel/polyfill'
import  axios from 'axios';
import {showAlert} from "./alert";

// import {loadStripe} from '@stripe/stripe-js';

// const stripe = await loadStripe('pk_test_51Mxsq4AiOwtWovsCPlBRi1csr6S89xLoOcj6LsU9XYEQBHpmvnVoMmIAKYQm0WOrhzQyHG81rolxq3sQdteDmN5K00u09dPXns');
export const bookTour = async (tourId) => {

    // import {loadStripe} from '@stripe/stripe-js';
    // const stripe = await loadStripe('pk_test_51Mxsq4AiOwtWovsCPlBRi1csr6S89xLoOcj6LsU9XYEQBHpmvnVoMmIAKYQm0WOrhzQyHG81rolxq3sQdteDmN5K00u09dPXns');
    var stripe = Stripe('pk_test_51Mxsq4AiOwtWovsCPlBRi1csr6S89xLoOcj6LsU9XYEQBHpmvnVoMmIAKYQm0WOrhzQyHG81rolxq3sQdteDmN5K00u09dPXns');
    try {
        // 1) Get checkout session from API
        const session = await axios({
                url: `/api/v1/booking/checkout-session/${tourId}`
            }
        );
        console.log(session);

        // 2) Create checkout form + chanre credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id,
        });
    } catch (err) {
        console.log(err);
        showAlert('error', err);
    }
};
