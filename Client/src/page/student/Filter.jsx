import { Label } from '@/components/ui/label';
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator';
import React, { useState } from 'react'

const categories = [
    // Existing categories
    { id: "data-science", label: "Data Science" },
    { id: "artificial-intelligence", label: "Artificial Intelligence" },
    { id: "frontend-development", label: "Frontend Development" },
    { id: "fullstack-development", label: "Fullstack Development" },
    { id: "mern-stack-development", label: "MERN Stack Development" },
    { id: "backend-development", label: "Backend Development" },
    { id: "html", label: "HTML" },
    { id: "css", label: "CSS" },
    { id: "javascript", label: "JavaScript" },
    { id: "typescript", label: "TypeScript" },
    { id: "node-js", label: "Node.js" },
    { id: "nextjs", label: "Next JS" },
    { id: "python", label: "Python" },
    { id: "docker", label: "Docker" },
    { id: "react", label: "React" },
    { id: "aws", label: "AWS" },
    { id: "graphql", label: "GraphQL" },
    { id: "kubernetes", label: "Kubernetes" },
    { id: "sql", label: "SQL" },
    { id: "mongodb", label: "MongoDB" },
    { id: "postgresql", label: "PostgreSQL" },
    { id: "rest api", label: "REST API" },
    { id: "git", label: "Git" },
    { id: "redux", label: "Redux" },
    { id: "nestjs", label: "NestJS" },
    { id: "machine-learning", label: "Machine Learning" },
    { id: "cybersecurity", label: "Cybersecurity" },
    { id: "ui-ux", label: "UI/UX Design" },
    { id: "react-native", label: "React Native" },
    { id: "web3", label: "Web3" },
    { id: "blockchain", label: "Blockchain" }
];

const Filter = ({ handleFilterChange }) => {
    // State management for selected filters
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [sortByPrice, setSortByPrice] = useState("");

    // Handle category checkbox changes
    const handleCategoryChange = (categoryId) => {
        setSelectedCategories(prev => {
            const newCategories = prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)  // Remove if unchecked
                : [...prev, categoryId];               // Add if checked
                
            // Propagate changes to parent component
            handleFilterChange(newCategories, sortByPrice);
            return newCategories;
        });
    };

    // Handle price sorting selection
    const selectByPriceHandler = (selectedValue) => {
        setSortByPrice(selectedValue);
        handleFilterChange(selectedCategories, selectedValue);
    }

    return (
        <div className='w-full md:w-[260px] sticky top-20 h-fit p-6 bg-background rounded-lg border shadow-sm'>
            {/* Header Section */}
            <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                    <h1 className="text-lg font-semibold">Filters</h1>
                    
                    {/* Price Sorting Dropdown */}
                    <Select onValueChange={selectByPriceHandler}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Price Sorting</SelectLabel>
                                <SelectItem value="low">Price: Low to High</SelectItem>
                                <SelectItem value="high">Price: High to Low</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                
                <Separator className="bg-muted" />
            </div>

            {/* Category Filter Section */}
            <div className='mt-6 space-y-3'>
                <h2 className="text-sm font-medium text-muted-foreground">CATEGORIES</h2>
                
                <div className='space-y-2'>
                    {categories.map((category) => (
                        <div 
                            key={category.id} 
                            className="flex items-center space-x-3 p-2 hover:bg-accent rounded-md transition-colors"
                        >
                            <Checkbox
                                id={category.id}
                                checked={selectedCategories.includes(category.id)}
                                onCheckedChange={() => handleCategoryChange(category.id)}
                            />
                            <Label 
                                htmlFor={category.id}
                                className="text-sm font-medium cursor-pointer select-none"
                            >
                                {category.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Filter
