import { Loader2 } from 'lucide-react';
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useCreateCheckoutSessionMutation } from '@/features/api/purchaseApi';
import { toast } from 'sonner';

const BuyCourseButton = ({ courseId, courseName, amount }) => {
    const [createCheckoutSession, { data, isLoading, isSuccess, isError, error }] = useCreateCheckoutSessionMutation();

    const purchaseCourseHandler = async () => {
        try {
            await createCheckoutSession({
                courseId,
                courseName,
                amount
            });
        } catch (error) {
            toast.error("Failed to initiate checkout");
        }
    };

    useEffect(() => {
        if (isSuccess && data?.url) {
            window.location.href = data.url;
        } else if (isSuccess) {
            toast.error("Failed to create checkout session");
            console.error("Checkout session error:", error, data);
        }
    }, [isSuccess, data, error]);

    useEffect(() => {
        if (isError) {
            console.error("Checkout error:", error);
            const message = error?.data?.error || error?.error || "Error creating checkout session";
            toast.error(message);
        }
    }, [isError, error]);

    return (
        <Button
            className='w-full bg-blue-600 hover:bg-blue-700 mb-3'
            onClick={purchaseCourseHandler}
            disabled={isLoading}
        >
            {isLoading ? (
                <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Please wait...
                </>
            ) : (
                "Enroll Now"
            )}
        </Button>
    );
};

export default BuyCourseButton;
