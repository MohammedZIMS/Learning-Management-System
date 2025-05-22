import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetAllPurchasedCoursesQuery } from '@/features/api/purchaseApi';
import React from 'react';
import {
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
} from 'recharts';

const InstructorDashboard = () => {
  const { data, isLoading, isError } = useGetAllPurchasedCoursesQuery();

  if (isLoading) return <h1 className="text-center text-lg mt-10">Loading...</h1>;
  if (isError) return <h1 className="text-center text-red-500 mt-10">Failed to load purchased courses</h1>;

  const purchasedCourses = data?.purchasedCourse || [];

  const courseData = purchasedCourses.map((purchase) => ({
    name: purchase.courseId?.courseTitle || 'Untitled',
    price: purchase.courseId?.coursePrice || 0,
  }));

  const totalRevenue = purchasedCourses.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );

  const totalSales = purchasedCourses.length;

  const currencyFormatter = new Intl.NumberFormat('bn-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6 px-4">
      {/* Total Sales Card */}
      <Card className="shadow-md hover:shadow-lg transition-shadow border-blue-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-600">
            Total Sales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-blue-800">{totalSales}</span>
          </div>
        </CardContent>
      </Card>

      {/* Total Revenue Card */}
      <Card className="shadow-md hover:shadow-lg transition-shadow border-green-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-600">
            Total Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-green-800">
              {currencyFormatter.format(totalRevenue)}
            </span>
            <span className="text-sm text-muted-foreground">BDT</span>
          </div>
        </CardContent>
      </Card>

      {/* Course Prices Chart */}
      <Card className="shadow-md hover:shadow-lg transition-shadow col-span-full border-purple-100">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            Course Price Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {courseData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={courseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                  tick={{ fontSize: 12 }}
                  stroke="#4b5563"
                />
                <YAxis
                  stroke="#4b5563"
                  tickFormatter={(value) => `${value} ৳`}
                  width={70}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                  }}
                  formatter={(value) => [`${value} ৳`, 'Price']}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ fill: '#6366f1', strokeWidth: 1 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructorDashboard;
