// src/pages/Plans.jsx
import { useState, useEffect } from "react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import toast, { Toaster } from "react-hot-toast";

export default function Plans() {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [userData, setUserData] = useState(null);

  // ✅ Load logged-in user from localStorage
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
      const res = await fetch(
        "http://localhost:8080/api/payments/create-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            amount: plan === "PREMIUM" ? 499 : 4999,
          }),
        }
      );

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
              toast.success(
                `🎉 Payment successful! Upgraded to ${plan} plan.`
              );

              const subscriptionEnd = new Date();
              subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);

              const updatedUser = {
                ...userData,
                tier: plan,
                subscriptionEndDate: subscriptionEnd.toISOString(),
              };
              localStorage.setItem("user", JSON.stringify(updatedUser));
              setUserData(updatedUser);

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
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
            Choose Your Plan
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-600">
            Select the perfect plan for your API needs. Start free, upgrade
            anytime.
          </p>

          {/* ✅ Logged in vs logged out */}
          {!userData ? (
            <div className="mt-6 flex flex-col items-center">
              <div className="px-4 py-2 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
                🚪 You are not logged in. Please{" "}
                <a
                  href="/login"
                  className="underline font-semibold text-indigo-700"
                >
                  log in
                </a>{" "}
                to subscribe.
              </div>
            </div>
          ) : (
            <div className="mt-6 flex flex-col items-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium mb-2">
                Logged in as{" "}
                <span className="font-semibold ml-1">{email}</span>
              </div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                Current Plan:{" "}
                <span className="font-semibold ml-1">{currentTier}</span>
                {daysRemaining > 0 && currentTier !== "FREE" && (
                  <span className="ml-2">
                    • {daysRemaining} days remaining
                  </span>
                )}
              </div>
              {daysRemaining !== null &&
                daysRemaining <= 7 &&
                currentTier !== "FREE" && (
                  <div className="mt-2 text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-md">
                    Your subscription will expire soon. Renew to continue
                    enjoying premium features.
                  </div>
                )}
            </div>
          )}
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-6">
          {plans.map((plan) => {
            const isCurrent = userData && plan.id === currentTier;
            const isDowngrade = userData && plan.id === "FREE" && currentTier !== "FREE";

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-2xl border bg-white p-8 shadow-sm transition-all hover:shadow-lg ${
                  plan.popular
                    ? "ring-2 ring-indigo-500 transform scale-105 border-indigo-100"
                    : "border-gray-200"
                } ${isCurrent ? "ring-2 ring-green-500 border-green-100" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-indigo-500 px-4 py-1 text-sm font-semibold text-white">
                      Most Popular
                    </span>
                  </div>
                )}

                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-green-500 px-4 py-1 text-sm font-semibold text-white">
                      Current Plan
                    </span>
                  </div>
                )}

                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {plan.name}
                  </h3>

                  <div className="mt-4 flex items-baseline">
                    <span className="text-5xl font-extrabold tracking-tight text-gray-900">
                      {plan.price}
                    </span>
                    <span className="ml-1 text-xl font-semibold text-gray-500">
                      {plan.priceDesc}
                    </span>
                  </div>

                  <p className="mt-4 text-gray-600">{plan.desc}</p>

                  {/* Features */}
                  <div className="mt-8">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                      Features
                    </h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <CheckIcon className="h-5 w-5 flex-shrink-0 text-green-500 mt-0.5" />
                          <span className="ml-3 text-sm text-gray-700">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Limitations */}
                  {plan.limitations.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                        Limitations
                      </h4>
                      <ul className="space-y-3">
                        {plan.limitations.map((limitation, index) => (
                          <li key={index} className="flex items-start">
                            <XMarkIcon className="h-5 w-5 flex-shrink-0 text-red-400 mt-0.5" />
                            <span className="ml-3 text-sm text-gray-500">
                              {limitation}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="mt-8">
                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={
                      !userData ||
                      (isCurrent && plan.id !== "FREE") ||
                      (loading && selectedPlan === plan.id)
                    }
                    className={`w-full rounded-lg px-6 py-4 text-center text-sm font-semibold leading-4 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${
                      !userData
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : isCurrent && plan.id !== "FREE"
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : plan.buttonStyle
                    } ${
                      loading && selectedPlan === plan.id
                        ? "opacity-75 cursor-wait"
                        : ""
                    }`}
                  >
                    {!userData
                      ? "🔒 Log in to subscribe"
                      : loading && selectedPlan === plan.id
                      ? "Processing..."
                      : isCurrent
                      ? "✅ Current Plan"
                      : isDowngrade
                      ? "Switch to Free Plan"
                      : `Upgrade to ${plan.name}`}
                  </button>

                  {isDowngrade && (
                    <p className="mt-2 text-xs text-gray-500 text-center">
                      Your premium features will remain until your subscription
                      end date
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Can I switch plans anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade your plan at any time. Downgrades to Free
                will take effect at the end of your billing cycle.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                What happens when my subscription ends?
              </h3>
              <p className="text-gray-600">
                Your account will automatically revert to Free, and you’ll lose
                access to premium features until you renew.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600">
                We offer a 14-day money-back guarantee for all paid plans.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can cancel anytime. You’ll still have access to your
                paid plan until the billing period ends.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
