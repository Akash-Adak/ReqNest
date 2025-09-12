import { useState, useEffect } from "react";

// Mock icons for demo
const CheckIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
  </svg>
);

const XMarkIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
  </svg>
);

// Mock toast for demo
const toast = {
  error: (msg) => console.log(`ERROR: ${msg}`),
  success: (msg) => console.log(`SUCCESS: ${msg}`)
};

const Toaster = () => null;

export default function Plans() {
const baseUrl = import.meta.env.VITE_API_URL;


    const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    setUserData(loggedInUser);
  }, []);

  // ✅ Load logged-in user from localStorage (simulated for demo)
  // useEffect(() => {
  //   // Simulated user data for demo
  //   const mockUser = {
  //     email: "demo@example.com",
  //     tier: "PREMIUM",
  //     subscriptionEndDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
  //   };
  //   setUserData(mockUser);
  // }, []);

  const email = userData?.email || null;
  const currentTier = userData ? userData.tier : null;
  const subscriptionEndDate = userData?.subscriptionEndDate || null;

  // ✅ Days remaining for paid plans
  const getDaysRemaining = () => {
    if (!subscriptionEndDate) return null;
    const endDate = new Date(subscriptionEndDate);
    const today = new Date();
    const diffTime = endDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  const daysRemaining = getDaysRemaining();

  const handleUpgrade = async (plan) => {
    if (!userData) {
      toast.error("⚠️ Please log in to upgrade your plan.");
      return;
    }
 try {
    setLoading(true);
    setSelectedPlan(plan);

    // Downgrade to FREE
    if (plan === "FREE") {
      try {
        const res = await fetch(
          `http://localhost:8080/api/upgrade?apiKey=${encodeURIComponent(
            email
          )}&newTier=${encodeURIComponent(plan)}`,
          {
            method: "POST",
            credentials: "include",
          }
        );
        if (res.ok) {
          const updatedUser = {
            ...userData,
            tier: "FREE",
            subscriptionEndDate: null,
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setUserData(updatedUser);
          toast.success("✅ Successfully switched to Free plan");
          setTimeout(() => window.location.reload(), 1500);
        } else {
          throw new Error("Failed to downgrade");
        }
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
        setSelectedPlan(null);
      }
      return;
    }

    // Paid plan flow
    const res = await fetch("http://localhost:8080/api/payments/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        amount: plan === "PREMIUM" ? 499 : 4999,
      }),
    });

    if (!res.ok) throw new Error("Failed to create order");
    const order = await res.json();

    const options = {
      key: order.key,
      amount: order.amount,
      currency: order.currency,
      name: "ReqNest API Service",
      description: `${plan} Plan Subscription`,
      order_id: order.orderId,
      handler: async function (response) {
        try {
          const verifyRes = await fetch(
            "http://localhost:8080/api/payments/verify",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                email: email,
                plan,
              }),
            }
          );

          const verifyData = await verifyRes.json();
          if (verifyData.verified) {
            toast.success(`🎉 Payment successful! Upgraded to ${plan} plan.`);

            // Set subscription expiry
            const subscriptionEnd = new Date();
            subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);

            const updatedUser = {
              ...userData,
              tier: plan,
              subscriptionEndDate: subscriptionEnd.toISOString(),
            };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUserData(updatedUser);

            // 📧 Send invoice/billing email
                    try {
            const emailForm = new FormData();
            emailForm.append("to", email);
            emailForm.append("subject", `Your ${plan} Plan Invoice - ReqNest`);
            emailForm.append("body", "Please find your invoice attached.");
            emailForm.append("plan", plan);
            emailForm.append("amount", plan === "PREMIUM" ? "499" : "4999");
            emailForm.append("validUntil", subscriptionEnd.toDateString());

            await fetch("http://localhost:8080/email/send", {
              method: "POST",
              body: emailForm,
              credentials: "include",
            });


            console.log("📧 Invoice email sent");
          } catch (err) {
            console.error("Email sending failed", err);
          }


            setTimeout(() => window.location.reload(), 1500);
          } else {
            toast.error("❌ Payment verification failed");
          }
        } catch (err) {
          toast.error(err.message);
        }
      },
      prefill: { email },
      theme: { color: "#4f46e5" },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  } catch (err) {
    toast.error(err.message);
  } finally {
    setLoading(false);
    setSelectedPlan(null);
  }
    // Simulate API call
    setTimeout(() => {
      toast.success(`Demo: Would upgrade to ${plan} plan`);
      setLoading(false);
      setSelectedPlan(null);
    }, 2000);
  };

  const plans = [
    {
      id: "FREE",
      name: "Free",
      price: "₹0",
      priceDesc: "forever",
      desc: "Perfect for getting started with basic API testing",
      features: [
        "100 requests/day",
        "Basic API testing",
        "Community support",
        "1 workspace",
        "30-day data retention",
        "Limited analytics",
      ],
      limitations: ["No priority support", "Rate limiting applies", "No custom domains"],
      buttonStyle:
        "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300",
      gradient: "from-gray-50 to-gray-100",
      accentColor: "gray"
    },
    {
      id: "PREMIUM",
      name: "Premium",
      price: "₹499",
      priceDesc: "per month",
      desc: "For individuals and small teams with growing needs",
      features: [
        "10,000 requests/month",
        "Advanced API testing tools",
        "Priority email support",
        "5 workspaces",
        "90-day data retention",
        "Basic analytics dashboard",
        "Custom response mocking",
        "API documentation",
      ],
      limitations: ["No SLA guarantee", "Limited team members"],
      popular: true,
      buttonStyle: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md",
      gradient: "from-indigo-50 via-purple-50 to-pink-50",
      accentColor: "indigo"
    },
    {
      id: "ENTERPRISE",
      name: "Enterprise",
      price: "₹4999",
      priceDesc: "per month",
      desc: "For companies with high-volume API requirements",
      features: [
        "1M requests/month",
        "Unlimited API testing",
        "24/7 dedicated support",
        "Unlimited workspaces",
        "1-year data retention",
        "Advanced analytics & reports",
        "Custom SLAs (99.9% uptime)",
        "Team management & RBAC",
        "Custom domains & SSL",
        "Webhook integrations",
        "API usage analytics",
        "Export capabilities",
      ],
      limitations: [],
      buttonStyle: "bg-purple-600 text-white hover:bg-purple-700 shadow-md",
      gradient: "from-purple-50 via-pink-50 to-purple-100",
      accentColor: "purple"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <Toaster />
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-20 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-80 h-80 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="relative">
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-6 tracking-tight">
              Choose Your Plan
            </h1>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
          </div>
          
          <p className="mt-8 max-w-2xl mx-auto text-xl text-slate-300 leading-relaxed">
            Select the perfect plan for your API needs. Start free, upgrade anytime with our 
            <span className="text-blue-400 font-semibold"> flexible pricing</span>.
          </p>

          {/* User Status */}
          {!userData ? (
            <div className="mt-8 flex flex-col items-center">
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative px-6 py-3 bg-slate-800 rounded-2xl border border-slate-600">
                  <span className="text-yellow-400 font-medium">🚪 You are not logged in. Please </span>
                  <a href="/login" className="text-blue-400 hover:text-blue-300 font-bold underline decoration-2 underline-offset-2 transition-colors">
                    log in
                  </a>
                  <span className="text-yellow-400 font-medium"> to subscribe.</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-8 flex flex-col items-center space-y-4">
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative px-6 py-3 bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-600 flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-slate-300">Logged in as</span>
                  <span className="font-bold text-blue-400">{email}</span>
                </div>
              </div>
              
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative px-6 py-3 bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-600 flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-slate-300">Current Plan:</span>
                  <span className="font-bold text-purple-400">{currentTier}</span>
                  {daysRemaining > 0 && currentTier !== "FREE" && (
                    <>
                      <span className="text-slate-400">•</span>
                      <span className="text-blue-400 font-medium">{daysRemaining} days remaining</span>
                    </>
                  )}
                </div>
              </div>
              
              {daysRemaining !== null && daysRemaining <= 7 && currentTier !== "FREE" && (
                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl blur opacity-75 animate-pulse"></div>
                  <div className="relative px-6 py-3 bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-orange-400/50 flex items-center space-x-3">
                    <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="text-orange-300 text-sm font-medium">
                      Your subscription expires soon. Renew to continue premium features.
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-8 mb-20">
          {plans.map((plan, index) => {
            const isCurrent = userData && plan.id === currentTier;
            const isDowngrade = userData && plan.id === "FREE" && currentTier !== "FREE";

            return (
              <div
                key={plan.id}
                className={`relative group ${plan.popular ? 'lg:-mt-4 lg:mb-4' : ''}`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Glow effect */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${
                  plan.popular 
                    ? 'from-indigo-500 via-purple-500 to-pink-500' 
                    : isCurrent 
                    ? 'from-green-400 via-blue-500 to-purple-500'
                    : 'from-slate-600 via-slate-700 to-slate-600'
                } rounded-3xl blur-lg opacity-50 group-hover:opacity-75 transition duration-500`}></div>
                
                <div className={`relative flex flex-col rounded-3xl border bg-slate-800/80 backdrop-blur-xl p-8 shadow-2xl transition-all duration-500 group-hover:scale-105 ${
                  plan.popular || isCurrent
                    ? 'border-indigo-400/50'
                    : 'border-slate-600/50'
                }`}>
                  
                  {/* Badge */}
                  {plan.popular && !isCurrent && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-75"></div>
                        <span className="relative inline-flex items-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-2 text-sm font-bold text-white shadow-lg">
                          ⭐ Most Popular
                        </span>
                      </div>
                    </div>
                  )}

                  {isCurrent && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur opacity-75"></div>
                        <span className="relative inline-flex items-center rounded-full bg-gradient-to-r from-green-400 to-blue-500 px-6 py-2 text-sm font-bold text-white shadow-lg">
                          ✅ Current Plan
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex-1">
                    {/* Plan Header */}
                    <div className="text-center mb-8 pt-4">
                      <h3 className="text-3xl font-bold text-white mb-2">
                        {plan.name}
                      </h3>
                      
                      <div className="flex items-baseline justify-center mb-4">
                        <span className={`text-6xl font-black bg-gradient-to-r ${
                          plan.accentColor === 'indigo' ? 'from-indigo-400 to-purple-400' :
                          plan.accentColor === 'purple' ? 'from-purple-400 to-pink-400' :
                          'from-slate-400 to-slate-500'
                        } bg-clip-text text-transparent`}>
                          {plan.price}
                        </span>
                        <span className="ml-2 text-xl font-semibold text-slate-400">
                          {plan.priceDesc}
                        </span>
                      </div>

                      <p className="text-slate-300 text-lg leading-relaxed">{plan.desc}</p>
                    </div>

                    {/* Features */}
                    <div className="mb-8">
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        What's included
                      </h4>
                      <ul className="space-y-4">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start group/item">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center mr-3 mt-0.5">
                              <CheckIcon className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-slate-300 group-hover/item:text-white transition-colors duration-200">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Limitations */}
                    {plan.limitations.length > 0 && (
                      <div className="mb-8 pt-6 border-t border-slate-700">
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center">
                          <svg className="w-4 h-4 mr-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          Limitations
                        </h4>
                        <ul className="space-y-3">
                          {plan.limitations.map((limitation, index) => (
                            <li key={index} className="flex items-start">
                              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-red-400 to-orange-500 flex items-center justify-center mr-3 mt-0.5">
                                <XMarkIcon className="h-3 w-3 text-white" />
                              </div>
                              <span className="text-slate-400 text-sm">
                                {limitation}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <div className="relative group/btn">
                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${
                      plan.accentColor === 'indigo' ? 'from-indigo-500 to-purple-500' :
                      plan.accentColor === 'purple' ? 'from-purple-500 to-pink-500' :
                      'from-slate-500 to-slate-600'
                    } rounded-2xl blur opacity-0 group-hover/btn:opacity-75 transition duration-300`}></div>
                    
                    <button
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={
                        !userData ||
                        (isCurrent && plan.id !== "FREE") ||
                        (loading && selectedPlan === plan.id)
                      }
                      className={`relative w-full rounded-2xl px-8 py-4 text-center font-bold text-lg transition-all duration-300 transform ${
                        !userData
                          ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                          : isCurrent && plan.id !== "FREE"
                          ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                          : plan.accentColor === 'indigo'
                          ? "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
                          : plan.accentColor === 'purple'
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
                          : "bg-slate-600 hover:bg-slate-500 text-white shadow-lg hover:shadow-xl hover:scale-105"
                      } ${
                        loading && selectedPlan === plan.id
                          ? "opacity-75 cursor-wait"
                          : ""
                      }`}
                    >
                      {!userData
                        ? "🔒 Log in to subscribe"
                        : loading && selectedPlan === plan.id
                        ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </span>
                        )
                        : isCurrent
                        ? "✅ Current Plan"
                        : isDowngrade
                        ? "Switch to Free Plan"
                        : `Upgrade to ${plan.name}`}
                    </button>

                    {isDowngrade && (
                      <p className="mt-3 text-xs text-slate-400 text-center">
                        Your premium features will remain until your subscription end date
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition duration-500"></div>
          
          <div className="relative bg-slate-800/70 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-slate-700/50">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-4">
                Frequently Asked Questions
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  q: "Can I switch plans anytime?",
                  a: "Yes, you can upgrade your plan at any time. Downgrades to Free will take effect at the end of your billing cycle."
                },
                {
                  q: "What happens when my subscription ends?",
                  a: "Your account will automatically revert to Free, and you'll lose access to premium features until you renew."
                },
                {
                  q: "Do you offer refunds?",
                  a: "We offer a 14-day money-back guarantee for all paid plans."
                },
                {
                  q: "Can I cancel anytime?",
                  a: "Yes, you can cancel anytime. You'll still have access to your paid plan until the billing period ends."
                }
              ].map((faq, index) => (
                <div key={index} className="group/faq p-6 rounded-2xl bg-slate-700/30 border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 hover:bg-slate-700/50">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover/faq:text-blue-400 transition-colors">
                    {faq.q}
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}