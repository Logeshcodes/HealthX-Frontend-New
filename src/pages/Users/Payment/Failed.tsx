import  {  useState } from 'react';
import { XCircle,  MessageCircle, ArrowLeft, } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent} from '../../../components/Common/card/Card2';
import { Button } from '../../../components/Common/button/Button2';
import { Alert, AlertDescription } from '../../../components/AdminComponents/common/Alert';

const PaymentFailurePage = () => {
    
    const [showAnimation, setShowAnimation] = useState(false);

   console.log(setShowAnimation)


    const handleContactSupport = () => {
        window.location.href = '/user/about';
    };

    

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-50 flex items-center justify-center p-4">
            <div className="max-w-3xl w-full space-y-8">
                {/* Failure Animation */}
                <div className="flex justify-center">
                    <div className={`rounded-full bg-red-100 p-6 transition-all duration-500 ${
                        showAnimation ? 'animate-bounce scale-100 opacity-100' : 'scale-50 opacity-0'
                    }`}>
                        <XCircle className="w-16 h-16 text-red-500" />
                    </div>
                </div>

                {/* Failure Message */}
                <div className="text-center space-y-3 animate-fadeIn">
                    <h1 className="text-4xl font-bold text-red-600">Payment Failed</h1>
                    <p className="text-gray-600">We couldn't process your payment. Don't worry, your appointment is still saved.</p>
                </div>

                {/* Error Details Card */}
                <Card className="w-full bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <CardHeader className="border-b border-gray-100">
                        <CardTitle className="text-2xl font-semibold text-gray-800">Transaction Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 p-6">
                        {/* Alert Message */}
                        <Alert className="bg-red-50 border-red-200">
                           
                            <AlertDescription>
                                The payment was declined. This could be due to insufficient funds, expired card, or other banking issues.
                            </AlertDescription>
                        </Alert>

                       

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
                            {/* <Button 
                                className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                                onClick={handleRetryPayment}
                            >
                                <RefreshCcw className="w-4 h-4" />
                                Retry Payment
                            </Button> */}
                            <Button 
                                variant="outline"
                                className="border-red-600 text-red-600 hover:bg-red-50 flex items-center gap-2"
                                onClick={handleContactSupport}
                            >
                                <MessageCircle className="w-4 h-4" />
                                Contact Support
                            </Button>
                            <Button 
                                variant="outline"
                                className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                onClick={() => window.location.href = '/user/appointments'}
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Appointments
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Help Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Common Reasons for Payment Failure</h2>
                    <ul className="space-y-2 text-gray-600">
                        <li className="flex items-start space-x-2">
                            <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2"></span>
                            <span>Insufficient funds in the account</span>
                        </li>
                        <li className="flex items-start space-x-2">
                            <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2"></span>
                            <span>Incorrect card details entered</span>
                        </li>
                        <li className="flex items-start space-x-2">
                            <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2"></span>
                            <span>Bank server timeout or technical issues</span>
                        </li>
                        <li className="flex items-start space-x-2">
                            <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2"></span>
                            <span>Card expired or blocked</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailurePage;