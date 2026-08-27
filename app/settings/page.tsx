"use client";

import { useState } from "react";
import FileUpload from "../components/FileUpload";
import { useUserProfile } from "../components/UserProfileProvider";
import { useTheme } from "../components/ThemeProvider";

const settingsTabs = [
  { id: "general", label: "General Profile", icon: "person" },
  { id: "notifications", label: "Notifications", icon: "notifications" },
  { id: "security", label: "Security & Password", icon: "lock" },
  { id: "integrations", label: "Integrations", icon: "extension" },
  { id: "billing", label: "Billing", icon: "credit_card" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  function handleSave(message: string) {
    setSaveMessage(message);
    setTimeout(() => setSaveMessage(null), 3000);
  }

  return (
    <>
      {/* Sticky Top Nav */}
      <header className="min-h-[4.5rem] py-3 sm:py-0 sm:h-20 bg-background sticky top-14 lg:top-0 z-40 border-b border-outline-variant/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-body-sm text-on-surface-variant font-medium">
            Good Morning, Jetnetix
          </p>
          <h1 className="text-headline-xl font-headline-xl text-on-surface">
            Settings
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSave("All settings saved successfully!")}
            className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-lg hover:opacity-90 active:scale-95 transition-all text-label-md font-bold shadow-[0px_1px_3px_rgba(0,0,0,0.04),_0px_10px_15px_-3px_rgba(0,0,0,0.03)]"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            Save Changes
          </button>
          <div className="h-8 w-px bg-outline-variant/30 mx-1" />
          <button className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </header>

      {/* Page Content */}
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto">
        {saveMessage && (
          <div className="mb-6 px-4 py-3 bg-tertiary/10 border border-tertiary/20 rounded-xl flex items-center gap-2 text-tertiary font-semibold">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            {saveMessage}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Left: Settings Nav */}
          <div className="md:col-span-1">
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 overflow-hidden shadow-[0px_1px_3px_rgba(0,0,0,0.04),_0px_10px_15px_-3px_rgba(0,0,0,0.03)]">
              {settingsTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-left border-l-4 transition-all text-label-md font-medium ${
                      isActive
                        ? "bg-primary/5 border-primary text-primary font-bold"
                        : "border-transparent text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                    >
                      {tab.icon}
                    </span>
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Form Panel */}
          <div className="md:col-span-3">
            {activeTab === "general" && <GeneralProfilePanel onSave={() => handleSave("Profile saved successfully!")} />}
            {activeTab === "notifications" && <NotificationsPanel onSave={() => handleSave("Notification preferences saved!")} />}
            {activeTab === "security" && <SecurityPanel onSave={() => handleSave("Security settings updated!")} />}
            {activeTab === "integrations" && <IntegrationsPanel />}
            {activeTab === "billing" && <BillingPanel onSave={() => handleSave("Billing information saved!")} />}
          </div>
        </div>
      </div>
    </>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-[0px_1px_3px_rgba(0,0,0,0.04),_0px_10px_15px_-3px_rgba(0,0,0,0.03)] overflow-hidden">
      <div className="px-6 py-5 border-b border-outline-variant/30">
        <h2 className="text-headline-md font-headline-md text-on-surface">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function InputField({
  label,
  type = "text",
  defaultValue,
  placeholder,
  className = "",
}: {
  label: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="block text-label-sm text-on-surface-variant font-medium">
        {label}
      </label>
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline"
      />
    </div>
  );
}

function PasswordField({
  label,
  placeholder = "••••••••",
  className = "",
}: {
  label: string;
  placeholder?: string;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);
  const inputId = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={`space-y-1.5 ${className}`}>
      <label htmlFor={inputId} className="block text-label-sm text-on-surface-variant font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={label.includes("Current") ? "current-password" : "new-password"}
          className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-4 pr-12 py-2.5 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          <span className="material-symbols-outlined text-[20px]">
            {visible ? "visibility_off" : "visibility"}
          </span>
        </button>
      </div>
    </div>
  );
}

function GeneralProfilePanel({ onSave }: { onSave: () => void }) {
  const { avatar, setAvatar } = useUserProfile();
  const { theme, setTheme } = useTheme();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [avatarSaved, setAvatarSaved] = useState(false);

  return (
    <div className="space-y-6">
      <SectionCard title="General Profile Settings">
        <form
          className="space-y-8"
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
        >
          <div>
            <FileUpload
              variant="avatar"
              accept="image/jpeg,image/png,image/gif,image/webp"
              maxSize={800 * 1024}
              previewUrl={avatar}
              buttonLabel="Change Avatar"
              hint="JPG, GIF or PNG. Max size of 800K"
              onPreviewChange={(url) => {
                if (url) {
                  setAvatar(url);
                  setAvatarSaved(true);
                  setUploadError(null);
                  setTimeout(() => setAvatarSaved(false), 2500);
                }
              }}
              onError={setUploadError}
            />
            {uploadError && (
              <p className="text-body-sm text-error mt-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">error</span>
                {uploadError}
              </p>
            )}
            {avatarSaved && (
              <p className="text-body-sm text-tertiary mt-2 flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                Profile picture updated
              </p>
            )}
          </div>

          {/* Theme & Appearance Selection */}
          <div className="space-y-3 pt-2">
            <label className="block text-label-sm text-on-surface-variant font-medium">
              Theme & Appearance
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`p-4 rounded-xl border flex items-center gap-3.5 transition-all text-left cursor-pointer ${
                  theme === "light"
                    ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20 font-bold"
                    : "border-outline-variant/40 bg-surface-container-low text-on-surface hover:bg-surface-container"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${theme === "light" ? "bg-primary text-white" : "bg-surface-container-high text-on-surface-variant"}`}>
                  <span className="material-symbols-outlined text-[22px]">light_mode</span>
                </div>
                <div>
                  <p className="text-label-md font-bold">Light Theme</p>
                  <p className="text-[11px] text-on-surface-variant font-normal">Clean, bright workspace</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`p-4 rounded-xl border flex items-center gap-3.5 transition-all text-left cursor-pointer ${
                  theme === "dark"
                    ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20 font-bold"
                    : "border-outline-variant/40 bg-surface-container-low text-on-surface hover:bg-surface-container"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${theme === "dark" ? "bg-primary text-white" : "bg-surface-container-high text-amber-400"}`}>
                  <span className="material-symbols-outlined text-[22px]">dark_mode</span>
                </div>
                <div>
                  <p className="text-label-md font-bold">Dark Theme</p>
                  <p className="text-[11px] text-on-surface-variant font-normal">High-contrast midnight theme</p>
                </div>
              </button>
            </div>
          </div>

          {/* Name fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="First Name" defaultValue="Jetnetix" />
            <InputField label="Last Name" defaultValue="Admin" />
            <InputField
              label="Email Address"
              type="email"
              defaultValue="admin@drImpact.com"
              className="md:col-span-2"
            />
            <InputField
              label="Phone Number"
              type="tel"
              defaultValue="+1 (555) 000-0000"
              className="md:col-span-2"
            />
            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-label-sm text-on-surface-variant font-medium">
                Bio
              </label>
              <textarea
                rows={4}
                defaultValue="Administrator for the drImpact Real Estate CRM platform. Managing premium real estate operations across multiple regions."
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-outline-variant/30 flex justify-end gap-3">
            <button
              type="button"
              className="px-5 py-2.5 border border-outline-variant rounded-lg text-label-md text-on-surface hover:bg-surface-container-low transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md font-bold hover:opacity-90 transition-all shadow-[0px_1px_3px_rgba(0,0,0,0.04)]"
            >
              Save Profile
            </button>
          </div>
        </form>
      </SectionCard>
    </div>
  );
}

function NotificationsPanel({ onSave }: { onSave: () => void }) {
  const notifications = [
    { label: "New Lead Assigned", desc: "Receive alerts when a new lead is assigned to you", email: true, push: true, sms: false },
    { label: "Deal Status Change", desc: "Get notified when a deal moves to a new stage", email: true, push: false, sms: false },
    { label: "Client Follow-Up Reminders", desc: "Reminders for scheduled client follow-ups", email: true, push: true, sms: true },
    { label: "Property Listing Updates", desc: "Alerts when a listing you manage is updated", email: false, push: true, sms: false },
    { label: "Team Messages", desc: "Notifications for new messages from team members", email: true, push: true, sms: false },
  ];

  return (
    <SectionCard title="Notification Preferences">
      <div className="table-responsive custom-scrollbar">
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline-variant/30">
              <th className="text-left pb-4 text-label-sm text-outline font-semibold uppercase tracking-wider">Notification</th>
              <th className="text-center pb-4 text-label-sm text-outline font-semibold uppercase tracking-wider px-4">Email</th>
              <th className="text-center pb-4 text-label-sm text-outline font-semibold uppercase tracking-wider px-4">Push</th>
              <th className="text-center pb-4 text-label-sm text-outline font-semibold uppercase tracking-wider px-4">SMS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {notifications.map((n, i) => (
              <tr key={i}>
                <td className="py-4 pr-6">
                  <p className="text-body-md font-semibold text-on-surface">{n.label}</p>
                  <p className="text-body-sm text-outline mt-0.5">{n.desc}</p>
                </td>
                {[n.email, n.push, n.sms].map((checked, j) => (
                  <td key={j} className="py-4 text-center px-4">
                    <input
                      type="checkbox"
                      defaultChecked={checked}
                      className="w-4 h-4 accent-primary cursor-pointer"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pt-4 border-t border-outline-variant/30 flex justify-end mt-4">
        <button
          onClick={onSave}
          className="px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md font-bold hover:opacity-90 transition-all shadow-[0px_1px_3px_rgba(0,0,0,0.04)]"
        >
          Save Preferences
        </button>
      </div>
    </SectionCard>
  );
}

function SecurityPanel({ onSave }: { onSave: () => void }) {
  return (
    <div className="space-y-6">
      <SectionCard title="Change Password">
        <div className="space-y-6">
          <PasswordField label="Current Password" />
          <PasswordField label="New Password" />
          <PasswordField label="Confirm New Password" />
          <div className="pt-2 flex justify-end">
            <button
              onClick={onSave}
              className="px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md font-bold hover:opacity-90 transition-all shadow-[0px_1px_3px_rgba(0,0,0,0.04)]"
            >
              Update Password
            </button>
          </div>
        </div>
      </SectionCard>
      <SectionCard title="Two-Factor Authentication">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-body-md font-semibold text-on-surface">Authenticator App</p>
            <p className="text-body-sm text-outline mt-0.5">Use Google Authenticator or Authy for 2FA</p>
          </div>
          <button className="px-4 py-2 bg-tertiary/10 text-tertiary border border-tertiary/20 rounded-lg text-label-md font-semibold hover:bg-tertiary/20 transition-colors">
            Enable 2FA
          </button>
        </div>
      </SectionCard>
    </div>
  );
}

function IntegrationsPanel() {
  const integrations = [
    { name: "Google Calendar", desc: "Sync appointments and follow-ups", icon: "calendar_today", connected: true, color: "text-error" },
    { name: "Slack", desc: "Team messaging and notifications", icon: "chat", connected: false, color: "text-tertiary" },
    { name: "Zapier", desc: "Automate workflows across apps", icon: "bolt", connected: true, color: "text-secondary" },
    { name: "DocuSign", desc: "E-signature for contracts and deeds", icon: "edit_document", connected: false, color: "text-primary" },
  ];
  return (
    <SectionCard title="Connected Integrations">
      <div className="space-y-4">
        {integrations.map((integration) => (
          <div
            key={integration.name}
            className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-outline-variant/20 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center">
                <span className={`material-symbols-outlined text-[24px] ${integration.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                  {integration.icon}
                </span>
              </div>
              <div>
                <p className="text-body-md font-semibold text-on-surface">{integration.name}</p>
                <p className="text-body-sm text-outline">{integration.desc}</p>
              </div>
            </div>
            <button
              className={`px-4 py-2 rounded-lg text-label-md font-semibold transition-colors ${
                integration.connected
                  ? "bg-error/10 text-error hover:bg-error/20 border border-error/20"
                  : "bg-primary text-on-primary hover:opacity-90 shadow-[0px_1px_3px_rgba(0,0,0,0.04)]"
              }`}
            >
              {integration.connected ? "Disconnect" : "Connect"}
            </button>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function BillingPanel({ onSave }: { onSave: () => void }) {
  return (
    <div className="space-y-6">
      <SectionCard title="Current Plan">
        <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/20">
          <div>
            <p className="text-label-md font-bold text-primary">Enterprise Plan</p>
            <p className="text-body-sm text-on-surface-variant mt-0.5">Unlimited agents · Full CRM access · Priority support</p>
          </div>
          <div className="text-right">
            <p className="text-headline-md font-bold text-on-surface">$299<span className="text-body-sm text-outline">/mo</span></p>
            <button className="text-primary text-label-sm font-bold hover:underline mt-1 block">
              Manage Plan
            </button>
          </div>
        </div>
      </SectionCard>
      <SectionCard title="Payment Method">
        <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-outline-variant/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-8 bg-on-surface rounded flex items-center justify-center">
              <span className="text-surface text-[10px] font-bold tracking-tight">VISA</span>
            </div>
            <div>
              <p className="text-body-md font-semibold text-on-surface">•••• •••• •••• 4242</p>
              <p className="text-body-sm text-outline">Expires 09/2027</p>
            </div>
          </div>
          <button className="px-4 py-2 border border-outline-variant rounded-lg text-label-md text-on-surface hover:bg-surface-container-high transition-colors">
            Update Card
          </button>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onSave}
            className="px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md font-bold hover:opacity-90 transition-all shadow-[0px_1px_3px_rgba(0,0,0,0.04)]"
          >
            Add Payment Method
          </button>
        </div>
      </SectionCard>
    </div>
  );
}
