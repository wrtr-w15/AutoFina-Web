"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import theme from "../themes/theme";
import { useTranslation } from "../i18n"; // frontend/i18n/index.ts
import Notification from "./Notification";

type OrderPayload = {
  projectName: string;
  shortDescription: string;
  technicalSpec: string;
  timeline: string;
  telegram: string;
  promo: string;
  email: string;
  message: string;
  order_type?: string;
};

const ring = "0 0 0 4px rgba(255,255,255,0.08)"; // еле-еле свечение

export default function OrderForm() {
  const { t } = useTranslation();
  const [form, setForm] = useState<OrderPayload>({
    projectName: "",
    shortDescription: "",
    technicalSpec: "",
    timeline: "",
    telegram: "",
    promo: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showSuccessIcon, setShowSuccessIcon] = useState(false);
  const [showErrorIcon, setShowErrorIcon] = useState(false);
  const [lastSubmissionTime, setLastSubmissionTime] = useState<number | null>(null);
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);

  // Save form data to cookies whenever it changes
  const saveFormToCookies = (formData: OrderPayload) => {
    if (typeof document !== 'undefined') {
      const cookieValue = JSON.stringify(formData);
      document.cookie = `orderFormData=${encodeURIComponent(cookieValue)}; path=/; max-age=86400`; // 24 hours
    }
  };

  // Load form data from cookies on component mount
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      const orderFormCookie = cookies.find(cookie => cookie.trim().startsWith('orderFormData='));
      
      if (orderFormCookie) {
        try {
          const cookieValue = decodeURIComponent(orderFormCookie.split('=')[1]);
          const parsedData = JSON.parse(cookieValue);
          setForm(parsedData);
        } catch (error) {
          console.error('Error parsing saved form data from cookies:', error);
        }
      }

      // Load last submission time
      const lastSubmission = localStorage.getItem('lastOrderSubmission');
      if (lastSubmission) {
        setLastSubmissionTime(parseInt(lastSubmission));
      }
    }
  }, []);

  // Update form with immediate saving to cookies
  const updateForm = (updates: Partial<OrderPayload>) => {
    const newForm = { ...form, ...updates };
    setForm(newForm);
    // Save immediately to cookies
    saveFormToCookies(newForm);
  };

  function validateForm() {
    const errors: string[] = [];
    
    if (!form.telegram.trim()) {
      errors.push(t("order.form.telegram") + " " + t("order.validation.required"));
    }
    
    if (!form.projectName.trim()) {
      errors.push(t("order.form.projectName") + " " + t("order.validation.required"));
    }
    
    if (!form.shortDescription.trim()) {
      errors.push(t("order.form.shortDescription") + " " + t("order.validation.required"));
    }
    
    if (!form.technicalSpec.trim()) {
      errors.push(t("order.form.technicalSpec") + " " + t("order.validation.required"));
    }
    
    if (!form.timeline.trim()) {
      errors.push(t("order.form.timeline") + " " + t("order.validation.required"));
    }
    
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.push(t("order.validation.emailInvalid"));
    }
    
    return errors;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Anti-DDoS check: prevent submission if less than 1 hour has passed
    const now = Date.now();
    const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
    
    if (lastSubmissionTime && (now - lastSubmissionTime) < oneHour) {
      const timeLeft = Math.ceil((oneHour - (now - lastSubmissionTime)) / (60 * 1000));
      const errorMessage = `${t("order.validation.rateLimit")} ${timeLeft} ${t("order.validation.minutes")}`;
      setRateLimitError(errorMessage);
      setShowNotification(true);
      setShowErrorIcon(true);
      return;
    }
    
    const errors = validateForm();
    
    if (errors.length > 0) {
      setError(errors.join(", "));
      return;
    }
    
    setShowConfirmation(true);
  }

  async function confirmSubmit() {
    if (!agreed) {
      setError(t("order.validation.agreementRequired"));
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    setShowConfirmation(false);
    
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          order_type: 'personal'
        }),
      });
      if (!res.ok) throw new Error("error");
      setSuccess("ok");
      setShowNotification(true);
      
      // Save submission time for anti-DDoS
      const submissionTime = Date.now();
      setLastSubmissionTime(submissionTime);
      localStorage.setItem('lastOrderSubmission', submissionTime.toString());
      
      // Auto-hide notification after 10 seconds and show success icon
      setTimeout(() => {
        setShowNotification(false);
        setShowSuccessIcon(true);
      }, 10000);
      
      setForm({
        projectName: "",
        shortDescription: "",
        technicalSpec: "",
        timeline: "",
        telegram: "",
        promo: "",
        email: "",
        message: "",
      });
      setAgreed(false);
      // Clear saved form data after successful submission
      if (typeof document !== 'undefined') {
        document.cookie = 'orderFormData=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
    } catch (err: any) {
      setError("error");
    } finally {
      setLoading(false);
    }
  }

  const baseInputStyle: React.CSSProperties = {
    background: theme.colors.muted,
    border: `1px solid ${theme.colors.border}`,
    color: theme.colors.foreground,
    borderRadius: "16px", // больше радиус
    transition: "box-shadow .2s ease, border-color .2s ease",
    outline: "none",
  };

  const onFocus = (el: HTMLElement) => {
    el.style.boxShadow = ring;
    el.style.borderColor = theme.colors.mutedForeground;
  };
  const onBlur = (el: HTMLElement) => {
    el.style.boxShadow = "none";
    el.style.borderColor = theme.colors.border;
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
      {/* Telegram - moved to top */}
      <Field
        label={t("order.form.telegram")}
        required
        input={
          <input
            className="w-full px-3 py-2 rounded-2xl"
            style={baseInputStyle}
            value={form.telegram}
            onFocus={(e) => onFocus(e.currentTarget)}
            onBlur={(e) => onBlur(e.currentTarget)}
            onChange={(e) => updateForm({ telegram: e.target.value })}
            placeholder={t("order.form.telegram_ph")}
          />
        }
      />

      {/* Название проекта */}
      <Field
        label={t("order.form.projectName")}
        required
        input={
          <input
            className="w-full px-3 py-2 rounded-2xl"
            style={baseInputStyle}
            value={form.projectName}
            onFocus={(e) => onFocus(e.currentTarget)}
            onBlur={(e) => onBlur(e.currentTarget)}
            onChange={(e) => updateForm({ projectName: e.target.value })}
            placeholder={t("order.form.projectName_ph")}
          />
        }
      />

      {/* Краткое описание проекта */}
      <Field
        label={t("order.form.shortDescription")}
        required
        input={
          <textarea
            className="w-full px-3 py-2 rounded-2xl resize-none"
            style={baseInputStyle}
            rows={3}
            value={form.shortDescription}
            onFocus={(e) => onFocus(e.currentTarget)}
            onBlur={(e) => onBlur(e.currentTarget)}
            onChange={(e) => updateForm({ shortDescription: e.target.value })}
            placeholder={t("order.form.shortDescription_ph")}
          />
        }
      />

      {/* Техническое задание */}
      <Field
        label={
          <div className="flex items-center justify-between">
            <span>{t("order.form.technicalSpec")}</span>
            <Link
              href="/guides/technical-specification"
              className="text-xs px-2 py-1 rounded-md transition"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: `1px solid ${theme.colors.border}`,
                color: theme.colors.mutedForeground,
              }}
              title={t("order.form.technicalSpecHelp")}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              }}
            >
              {t("order.form.technicalSpecHelp")}
            </Link>
          </div>
        }
        required
        input={
          <textarea
            className="w-full px-3 py-2 rounded-2xl resize-none"
            style={baseInputStyle}
            rows={5}
            value={form.technicalSpec}
            onFocus={(e) => onFocus(e.currentTarget)}
            onBlur={(e) => onBlur(e.currentTarget)}
            onChange={(e) => updateForm({ technicalSpec: e.target.value })}
            placeholder={t("order.form.technicalSpec_ph")}
          />
        }
      />

      {/* Сроки выполнения заказа */}
      <Field
        label={t("order.form.timeline")}
        input={
          <input
            className="w-full px-3 py-2 rounded-2xl"
            style={baseInputStyle}
            value={form.timeline}
            onFocus={(e) => onFocus(e.currentTarget)}
            onBlur={(e) => onBlur(e.currentTarget)}
            onChange={(e) => updateForm({ timeline: e.target.value })}
            placeholder={t("order.form.timeline_ph")}
          />
        }
      />


      {/* Промокод */}
      <Field
        label={t("order.form.promo")}
        input={
          <input
            className="w-full px-3 py-2 rounded-2xl"
            style={baseInputStyle}
            value={form.promo}
            onFocus={(e) => onFocus(e.currentTarget)}
            onBlur={(e) => onBlur(e.currentTarget)}
            onChange={(e) => updateForm({ promo: e.target.value })}
            placeholder={t("order.form.promo_ph")}
          />
        }
      />

      {/* Почта */}
      <Field
        label={t("order.form.email")}
        input={
          <input
            type="email"
            className="w-full px-3 py-2 rounded-2xl"
            style={baseInputStyle}
            value={form.email}
            onFocus={(e) => onFocus(e.currentTarget)}
            onBlur={(e) => onBlur(e.currentTarget)}
            onChange={(e) => updateForm({ email: e.target.value })}
            placeholder={t("order.form.email_ph")}
          />
        }
      />

      {/* Сообщение */}
      <Field
        label={t("order.form.message")}
        input={
          <textarea
            className="w-full px-3 py-2 rounded-2xl resize-none"
            style={baseInputStyle}
            rows={4}
            value={form.message}
            onFocus={(e) => onFocus(e.currentTarget)}
            onBlur={(e) => onBlur(e.currentTarget)}
            onChange={(e) => updateForm({ message: e.target.value })}
            placeholder={t("order.form.message_ph")}
          />
        }
      />

      <div className="relative">
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 rounded-2xl font-semibold transition disabled:opacity-60"
          style={{
            border: `1px solid ${theme.colors.mutedForeground}`,
            color: theme.colors.mutedForeground,
            background: "transparent",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.background = theme.colors.muted;
            el.style.color = theme.colors.foreground;
            el.style.boxShadow = theme.shadow?.soft || "0 6px 20px rgba(0,0,0,0.25)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.background = "transparent";
            el.style.color = theme.colors.mutedForeground;
            el.style.boxShadow = "none";
          }}
        >
          {loading ? t("order.form.submitting") : t("order.form.submit")}
        </button>
      
      {/* Success Icon */}
      {showSuccessIcon && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.3,
            type: "spring",
            stiffness: 200
          }}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer group"
          style={{ background: "#22c55e" }}
          title={t("order.success.title")}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            {t("order.success.title")}
          </div>
        </motion.div>
      )}

      {/* Error Icon */}
      {showErrorIcon && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.3,
            type: "spring",
            stiffness: 200
          }}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer group"
          style={{ background: "#ef4444" }}
          title={rateLimitError || ""}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            {rateLimitError}
          </div>
        </motion.div>
      )}
      </div>
      
      {error && <p className="text-sm" style={{ color: "#ef4444" }}>{error}</p>}
    </form>

    {/* Confirmation Dialog */}
    <AnimatePresence>
      {showConfirmation && (
        <motion.div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            background: "rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(8px)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="rounded-2xl p-8 max-w-4xl mx-4 relative"
            style={{ 
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(20px)",
              border: `1px solid rgba(255, 255, 255, 0.2)`,
              color: theme.colors.foreground,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)"
            }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Close button */}
            <button
              onClick={() => setShowConfirmation(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: `1px solid rgba(255, 255, 255, 0.2)`,
                color: theme.colors.mutedForeground,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-xl font-semibold mb-6 pr-8 text-center" style={{ color: theme.colors.foreground }}>
              {t("order.confirmation.title")}
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Left side - Data confirmation */}
              <div>
                <h4 className="text-lg font-medium mb-4" style={{ color: theme.colors.foreground }}>
                  {t("order.confirmation.dataTitle")}
                </h4>
                <div 
                  className="p-4 rounded-xl"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: `1px solid rgba(255, 255, 255, 0.1)`,
                  }}
                >
                  <div className="space-y-3">
                    <div>
                      <strong>{t("order.form.telegram")}:</strong> {form.telegram}
                    </div>
                    <div>
                      <strong>{t("order.form.projectName")}:</strong> {form.projectName}
                    </div>
                    <div>
                      <strong>{t("order.form.shortDescription")}:</strong> {form.shortDescription}
                    </div>
                    <div>
                      <strong>{t("order.form.timeline")}:</strong> {form.timeline}
                    </div>
                    {form.email && (
                      <div>
                        <strong>{t("order.form.email")}:</strong> {form.email}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right side - Telegram notification info */}
              <div>
                <h4 className="text-lg font-medium mb-4" style={{ color: theme.colors.foreground }}>
                  {t("order.confirmation.notificationTitle")}
                </h4>
                <div 
                  className="p-4 rounded-xl"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: `1px solid rgba(255, 255, 255, 0.1)`,
                  }}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: theme.colors.accent }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white">
                        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium" style={{ color: theme.colors.foreground }}>
                        {t("order.confirmation.telegramTitle")}
                      </div>
                      <div className="text-sm" style={{ color: theme.colors.mutedForeground }}>
                        {t("order.confirmation.telegramSubtitle")}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm" style={{ color: theme.colors.mutedForeground }}>
                    <div>• {t("order.confirmation.notification1")}</div>
                    <div>• {t("order.confirmation.notification2")}</div>
                    <div>• {t("order.confirmation.notification3")}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="relative">
                <input
                  type="checkbox"
                  id="agreement"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-5 h-5 rounded-md opacity-0 absolute"
                  style={{ 
                    accentColor: theme.colors.accent,
                  }}
                />
                <div 
                  className="w-5 h-5 rounded-md border-2 flex items-center justify-center transition"
                  style={{
                    borderColor: agreed ? theme.colors.accent : theme.colors.border,
                    background: agreed ? theme.colors.accent : "white",
                  }}
                >
                  {agreed && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <label htmlFor="agreement" className="text-sm cursor-pointer" style={{ color: theme.colors.mutedForeground }}>
                <span>{t("order.confirmation.agreement")}</span>
                <Link
                  href="/guides/terms-and-conditions"
                  className="ml-1 underline hover:no-underline transition"
                  style={{ color: theme.colors.accent }}
                  target="_blank"
                >
                  {t("order.confirmation.termsLink")}
                </Link>
              </label>
            </div>

            <div className="flex justify-center">
              <button
                onClick={confirmSubmit}
                disabled={!agreed || loading}
                className="px-12 py-4 rounded-xl font-semibold transition disabled:opacity-50"
                style={{
                  border: `1px solid ${theme.colors.mutedForeground}`,
                  color: theme.colors.mutedForeground,
                  background: "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.background = theme.colors.muted;
                    e.currentTarget.style.color = theme.colors.foreground;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = theme.colors.mutedForeground;
                  }
                }}
              >
                {loading ? t("order.form.submitting") : t("order.confirmation.confirm")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Notification Component */}
    <Notification
      show={showNotification}
      type={showErrorIcon ? "error" : "success"}
      title={showErrorIcon ? t("order.error.title") : t("order.success.title")}
      message={showErrorIcon ? (rateLimitError || "") : t("order.success.message")}
      onClose={() => {
        setShowNotification(false);
        if (showErrorIcon) {
          setShowErrorIcon(false);
          setRateLimitError(null);
        }
      }}
      autoHide={!showErrorIcon}
      duration={10000}
    />
    </>
  );
}

function Field({
  label,
  input,
  required,
}: {
  label: string | React.ReactNode;
  input: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm mb-1" style={{ color: theme.colors.mutedForeground }}>
        {typeof label === 'string' ? (
          <>
            {label} {required ? "*" : ""}
          </>
        ) : (
          label
        )}
      </label>
      {input}
    </div>
  );
}