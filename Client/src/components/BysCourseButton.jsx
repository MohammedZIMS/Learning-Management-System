import { Import } from 'lucide-react';
import React from 'react'
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const BysCourseButton = () => {
    const purchasedCourse = true; // This should be replaced with actual logic to check if the course is purchased

    // Function to handle button click
    const handleButtonClick = () => {
        if (purchasedCourse) {
            // Logic to continue learning
            console.log("Continue Learning");
        } else {
            // Logic to buy the course
            console.log("Buy Now");
        }
    }

    
    return (
        <div>
            {purchasedCourse ? (
                <>
                    <Button className='w-full bg-green-600 hover:bg-green-700 mb-3' onClick={handleButtonClick}>
                        Continue Learning
                    </Button>
                    <div className='text-center text-sm text-green-600 mb-4'>
                        You purchased this course on Oct 15, 2023
                    </div>
                </>
            ) : (
                <>
                    <Button className='w-full bg-blue-600 hover:bg-blue-700 mb-3' onClick={handleButtonClick}>
                        Buy Now
                    </Button>
                    <Button variant="outline" className='w-full mb-4'>
                        Add to Cart
                    </Button>
                </>
            )}
        </div>
    )
}

export default BysCourseButton
