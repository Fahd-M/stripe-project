import Stripe from 'stripe';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
            //should now be accepting cart items info in the req.body, do a quick check in terminal:
            console.log(req.body); 
//  [
//   {
//     _createdAt: '2022-11-25T03:03:25Z',
//     _id: '10ebeaac-d92f-4b3e-9206-f51badb5c63e',
//     _rev: 'z7EiK8inwybcbhSAyDAgag',
//     _type: 'product',
//     _updatedAt: '2022-11-25T03:04:45Z',
//     details: 'Use these while working out',
//     image: [ [Object], [Object], [Object], [Object] ],
//     name: 'Cool In-ear headphones',
//     price: 37,
//     slug: { _type: 'slug', current: 'cool-in-ear-headphones' },
//     quantity: 1
//   }
// ]


    try {

        const params = {
            submit_type: 'pay',
            mode:'payment',
            payment_method_types: ['card'],
            billing_address_collection:'auto',
            shipping_options: [
                { shipping_rate: 'shr_1M9HDyCe8ymw4WoprUEjDbUD' },
            ],
            line_items: req.body.map((item) => {
                const img = item.image[0].asset._ref
                const newImage = img.replace('image-', 'https://cdn.sanity.io/images/u7zo04n3/production/').replace('-webp', '.webp');
                // can also do replace('-jpeg', '.jpg') when file types different

                // once we have the image, return an object which reps one of our items
                return {
                    price_data: {
                        currency: 'usd', // must match the shipping rate currency 
                        product_data: {
                            name: item.name,
                            images: [newImage]
                        }, 
                        unit_amount: item.price * 100, 
                        //because unit amount must be in cents
                    },
                    adjustable_quantity: {
                        enabled:true,
                        minimum: 1,
                    },
                    quantity: item.quantity,
                }
            }),
            success_url: `${req.headers.origin}/success`,
            cancel_url: `${req.headers.origin}/canceled`,
          }

      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create(params);

      res.status(200).json(session);

    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}