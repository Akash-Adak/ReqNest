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
            `${baseUrl}/api/upgrade?apiKey=${encodeURIComponent(
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
      const amount = plan === "STARTUP" ? 99 * 100 : 
                    plan === "PROFESSIONAL" ? 499 * 100 : 
                    plan === "ENTERPRISE" ? 999 * 100 : 0;

      const res = await fetch(`${baseUrl}/api/payments/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          amount: amount,
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
              `${baseUrl}/api/payments/verify`,
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
                emailForm.append("amount", amount.toString());
                emailForm.append("validUntil", subscriptionEnd.toDateString());

                await fetch(`${baseUrl}/email/send`, {
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
  };

  const plans = [
    {
      id: "FREE",
      name: "Free",
      price: "$0",
      priceDesc: "per month",
      desc: "Perfect for getting started and small projects",
      features: [
        "10K API calls/month",
        "3 Projects",
        "1 Team member",
        "1GB Storage",
        "Community support",
        "Basic analytics",
        "REST APIs only",
      ],
      limitations: ["No priority support", "Rate limiting applies", "No custom domains"],
      buttonStyle: "bg-gray-800 text-white hover:bg-gray-700 border border-gray-600",
      popular: false,
      accentColor: "gray"
    },
    {
      id: "STARTUP",
      name: "Startup",
      price: "$99",
      priceDesc: "per month",
      desc: "For growing startups and small teams",
      features: [
        "100K API calls/month",
        "10 Projects",
        "5 Team members",
        "10GB Storage",
        "Email support",
        "Advanced analytics",
        "REST & GraphQL APIs",
        "Custom domains",
        "Webhook support",
      ],
      limitations: ["No SLA guarantee", "Limited custom features"],
      popular: true,
      buttonStyle: "bg-blue-600 text-white hover:bg-blue-700 border border-blue-500",
      accentColor: "blue"
    },
    {
      id: "PROFESSIONAL",
      name: "Professional",
      price: "$499",
      priceDesc: "per month",
      desc: "For established businesses with high demands",
      features: [
        "1M API calls/month",
        "50 Projects",
        "25 Team members",
        "100GB Storage",
        "Priority support",
        "Advanced analytics & reports",
        "REST & GraphQL APIs",
        "Custom domains & SSL",
        "Webhook integrations",
        "API usage analytics",
        "99.5% SLA",
        "Export capabilities",
      ],
      limitations: ["No dedicated support", "Limited custom integrations"],
      popular: false,
      buttonStyle: "bg-purple-600 text-white hover:bg-purple-700 border border-purple-500",
      accentColor: "purple"
    },
    {
      id: "ENTERPRISE",
      name: "Enterprise",
      price: "$999",
      priceDesc: "per month",
      desc: "For large organizations with custom requirements",
      features: [
        "Unlimited API calls",
        "Unlimited Projects",
        "Unlimited Team members",
        "Custom Storage",
        "24/7 Dedicated support",
        "Advanced analytics & custom reports",
        "REST & GraphQL APIs",
        "Custom domains & SSL",
        "Advanced webhook integrations",
        "Custom API usage analytics",
        "99.9% SLA guarantee",
        "Export capabilities",
        "Custom integrations",
        "On-premise deployment options",
        "Dedicated account manager",
        "Custom SLAs",
        "Training & onboarding",
      ],
      limitations: [],
      buttonStyle: "bg-black text-white hover:bg-gray-900 border border-white/20",
      popular: false,
      accentColor: "black"
    },
  ];

  const getAccentBorder = (color) => {
    switch (color) {
      case 'blue': return 'border-blue-500';
      case 'purple': return 'border-purple-500';
      case 'black': return 'border-white/30';
      default: return 'border-gray-500';
    }
  };

  const getAccentText = (color) => {
    switch (color) {
      case 'blue': return 'text-blue-400';
      case 'purple': return 'text-purple-400';
      case 'black': return 'text-white';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <Toaster />
      
      {/* Simple background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-white"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="relative">
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
              Choose Your Plan
            </h1>
            <div className="w-32 h-1 bg-white mx-auto mb-8"></div>
          </div>
          
          <p className="mt-8 max-w-2xl mx-auto text-xl text-gray-300 leading-relaxed">
            Scale your API infrastructure with our flexible pricing plans. 
            <span className="text-white font-bold"> Start free, upgrade as you grow.</span>
          </p>

          {/* User Status */}
          {!userData ? (
            <div className="mt-8">
              <div className="bg-gray-900 border border-gray-700 rounded-lg px-6 py-4 inline-block">
                <span className="text-yellow-400 font-medium">⚠️ You are not logged in. Please </span>
                <a href="/login" className="text-white font-bold underline">
                  log in
                </a>
                <span className="text-yellow-400 font-medium"> to subscribe.</span>
              </div>
            </div>
          ) : (
            <div className="mt-8 flex flex-col items-center space-y-4">
              <div className="bg-gray-900 border border-gray-700 rounded-lg px-6 py-3 flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-300">Logged in as</span>
                <span className="font-bold text-white">{email}</span>
              </div>
              
              <div className="bg-gray-900 border border-gray-700 rounded-lg px-6 py-3 flex items-center space-x-3">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckIcon className="h-3 w-3 text-black" />
                </div>
                <span className="text-gray-300">Current Plan:</span>
                <span className="font-bold text-white">{currentTier}</span>
                {daysRemaining > 0 && currentTier !== "FREE" && (
                  <>
                    <span className="text-gray-500">•</span>
                    <span className="text-blue-400 font-medium">{daysRemaining} days remaining</span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-20">
          {plans.map((plan, index) => {
            const isCurrent = userData && plan.id === currentTier;
            const isDowngrade = userData && plan.id === "FREE" && currentTier !== "FREE";

            return (
              <div
                key={plan.id}
                className={`relative group ${plan.popular ? 'lg:-mt-4 lg:mb-4' : ''}`}
              >
                <div className={`relative flex flex-col rounded-xl border-2 bg-black p-6 h-full ${
                  plan.popular ? getAccentBorder(plan.accentColor) + ' border-2' : 
                  isCurrent ? 'border-green-500 border-2' : 'border-gray-700'
                }`}>
                  
                  {/* Badge */}
                  {plan.popular && !isCurrent && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-600 text-white px-4 py-1 text-sm font-bold rounded-full border border-blue-400">
                        ⭐ MOST POPULAR
                      </span>
                    </div>
                  )}

                  {isCurrent && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-green-600 text-white px-4 py-1 text-sm font-bold rounded-full border border-green-400">
                        ✅ CURRENT PLAN
                      </span>
                    </div>
                  )}

                  <div className="flex-1">
                    {/* Plan Header */}
                    <div className="text-center mb-6 pt-2">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {plan.name}
                      </h3>
                      
                      <div className="flex items-baseline justify-center mb-3">
                        <span className={`text-4xl font-black ${
                          getAccentText(plan.accentColor)
                        }`}>
                          {plan.price}
                        </span>
                        <span className="ml-2 text-lg font-semibold text-gray-400">
                          {plan.priceDesc}
                        </span>
                      </div>

                      <p className="text-gray-400 text-sm leading-relaxed">{plan.desc}</p>
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                      <ul className="space-y-3">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <div className="flex-shrink-0 w-5 h-5 rounded bg-green-600 flex items-center justify-center mr-3 mt-0.5">
                              <CheckIcon className="h-3 w-3 text-black" />
                            </div>
                            <span className="text-gray-300 text-sm">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Limitations */}
                    {plan.limitations.length > 0 && (
                      <div className="mb-6 pt-4 border-t border-gray-700">
                        <ul className="space-y-2">
                          {plan.limitations.map((limitation, index) => (
                            <li key={index} className="flex items-start">
                              <div className="flex-shrink-0 w-5 h-5 rounded bg-red-600 flex items-center justify-center mr-3 mt-0.5">
                                <XMarkIcon className="h-3 w-3 text-black" />
                              </div>
                              <span className="text-gray-500 text-sm">
                                {limitation}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <div className="mt-auto">
                    <button
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={
                        !userData ||
                        (isCurrent && plan.id !== "FREE") ||
                        (loading && selectedPlan === plan.id)
                      }
                      className={`w-full rounded-lg px-6 py-3 text-center font-bold transition-all duration-200 border-2 ${
                        !userData
                          ? "bg-gray-800 text-gray-400 border-gray-600 cursor-not-allowed"
                          : isCurrent && plan.id !== "FREE"
                          ? "bg-gray-800 text-gray-400 border-gray-600 cursor-not-allowed"
                          : plan.accentColor === 'blue'
                          ? "bg-blue-600 text-white border-blue-500 hover:bg-blue-700"
                          : plan.accentColor === 'purple'
                          ? "bg-purple-600 text-white border-purple-500 hover:bg-purple-700"
                          : plan.accentColor === 'gray'
                          ? "bg-gray-800 text-white border-gray-600 hover:bg-gray-700"
                          : "bg-black text-white border-white/30 hover:bg-white hover:text-black"
                      } ${
                        loading && selectedPlan === plan.id
                          ? "opacity-75 cursor-wait"
                          : ""
                      }`}
                    >
                      {!userData
                        ? "🔒 LOGIN TO SUBSCRIBE"
                        : loading && selectedPlan === plan.id
                        ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            PROCESSING...
                          </span>
                        )
                        : isCurrent
                        ? "CURRENT PLAN"
                        : isDowngrade
                        ? "SWITCH TO FREE"
                        : `UPGRADE TO ${plan.name}`}
                    </button>

                    {isDowngrade && (
                      <p className="mt-2 text-xs text-gray-500 text-center">
                        Premium features remain until subscription end
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison Table */}
        <div className="bg-black border border-gray-700 rounded-xl shadow-2xl p-8 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Plan Comparison
            </h2>
            <div className="w-24 h-1 bg-white mx-auto"></div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-4 text-white font-bold">Features</th>
                  {plans.map(plan => (
                    <th key={plan.id} className="text-center py-4 px-4 font-bold">
                      <div className={`text-lg ${getAccentText(plan.accentColor)}`}>
                        {plan.name}
                      </div>
                      <div className="text-gray-400 text-sm mt-1">{plan.price}/mo</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "API Calls", free: "10K/mo", startup: "100K/mo", professional: "1M/mo", enterprise: "Unlimited" },
                  { feature: "Projects", free: "3", startup: "10", professional: "50", enterprise: "Unlimited" },
                  { feature: "Team Members", free: "1", startup: "5", professional: "25", enterprise: "Unlimited" },
                  { feature: "Storage", free: "1GB", startup: "10GB", professional: "100GB", enterprise: "Custom" },
                  { feature: "Support", free: "Community", startup: "Email", professional: "Priority", enterprise: "24/7 Dedicated" },
                  { feature: "SLA Guarantee", free: "No", startup: "No", professional: "99.5%", enterprise: "99.9%" },
                  { feature: "Custom Domains", free: "No", startup: "Yes", professional: "Yes", enterprise: "Yes" },
                  { feature: "Analytics", free: "Basic", startup: "Advanced", professional: "Advanced + Reports", enterprise: "Custom" },
                ].map((row, index) => (
                  <tr key={index} className="border-b border-gray-800 hover:bg-gray-900">
                    <td className="py-4 px-4 text-gray-300 font-medium">{row.feature}</td>
                    <td className="py-4 px-4 text-center text-gray-400">{row.free}</td>
                    <td className="py-4 px-4 text-center text-gray-400">{row.startup}</td>
                    <td className="py-4 px-4 text-center text-gray-400">{row.professional}</td>
                    <td className="py-4 px-4 text-center text-gray-400">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-black border border-gray-700 rounded-xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <div className="w-24 h-1 bg-white mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                q: "Can I switch plans anytime?",
                a: "Yes, you can upgrade instantly. Downgrades take effect at the end of your billing cycle."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, PayPal, and bank transfers for Enterprise plans."
              },
              {
                q: "Do you offer refunds?",
                a: "Yes, we offer a 30-day money-back guarantee on all paid plans."
              },
              {
                q: "Can I cancel anytime?",
                a: "Absolutely. Cancel anytime and keep access until the end of your billing period."
              }
            ].map((faq, index) => (
              <div key={index} className="p-6 bg-gray-900 border border-gray-700 rounded-lg">
                <h3 className="text-lg font-bold text-white mb-3">
                  {faq.q}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}