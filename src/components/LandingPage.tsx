import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Database,
  EyeOff,
  GitBranch,
  Globe,
  Lock,
  Radio,
  Shield,
} from 'lucide-react';
import { ThreatGlobe3D } from './ThreatGlobe3D';

interface LandingPageProps {
  onScanClick: () => void;
  onHowItWorksClick: () => void;
  openDocs: () => void;
}

const productPillars = [
  {
    icon: Cpu,
    number: '01',
    title: 'Keep sensitive work local',
    description:
      'Use the in-browser secret scanner and cryptographic utilities without giving the demo your passwords or private keys.',
    color: 'text-emerald-300',
    border: 'border-emerald-400/20',
  },
  {
    icon: Globe,
    number: '02',
    title: 'Explore the threat picture',
    description:
      'Rotate the Three.js globe, inspect anonymized sample events, and compare them with the regional threat views.',
    color: 'text-cyan-300',
    border: 'border-cyan-400/20',
  },
  {
    icon: CheckCircle2,
    number: '03',
    title: 'Take a measured next step',
    description:
      'Follow a practical incident-response checklist. SentinelKey guides your actions; it does not change account settings for you.',
    color: 'text-amber-300',
    border: 'border-amber-400/20',
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onScanClick,
  onHowItWorksClick,
  openDocs,
}) => (
  <div className="min-h-screen bg-slate-950 text-slate-100">
    <section className="relative isolate overflow-hidden border-b border-slate-800/80 bg-[#070b11] px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_76%_45%,rgba(0,240,168,0.11),transparent_38%),linear-gradient(to_right,rgba(30,41,59,0.22)_1px,transparent_1px),linear-gradient(to_bottom,rgba(30,41,59,0.22)_1px,transparent_1px)] bg-[size:auto,4rem_4rem,4rem_4rem]" />

      <div className="mx-auto grid max-w-[1440px] items-center gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-12">
        <div className="relative z-10 space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3 py-1.5 text-xs font-medium text-emerald-300">
            <Shield className="h-3.5 w-3.5" />
            <span>Digital identity defense, built in Rwanda</span>
          </div>

          <div className="space-y-5">
            <h1 className="font-sans max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-white sm:text-5xl lg:text-[4.25rem]">
              See the risk.
              <span className="block text-emerald-300">Keep control.</span>
            </h1>
            <p className="max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              SentinelKey is an open-source workspace for understanding identity exposure, inspecting your security posture, and following a clear response plan—without handing your passwords to a service.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={onScanClick}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-300 px-6 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
            >
              Open the demo console
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={onHowItWorksClick}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-6 py-3 text-sm font-medium text-slate-200 transition-colors hover:border-slate-500 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
            >
              Explore the 3D threat map
              <Globe className="h-4 w-4 text-emerald-300" />
            </button>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-3 border-t border-slate-800 pt-5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-2">
              <EyeOff className="h-4 w-4 text-emerald-300" />
              Secrets stay on your device
            </span>
            <span className="inline-flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-cyan-300" />
              Open source · Apache 2.0
            </span>
            <span className="inline-flex items-center gap-2">
              <Lock className="h-4 w-4 text-amber-300" />
              Privacy-first by design
            </span>
          </div>

          <p className="max-w-xl text-[11px] leading-5 text-slate-500">
            This preview uses sample security records. It is not connected to a live breach feed and does not perform a background scan of your accounts or device.
          </p>
        </div>

        <div className="relative min-w-0">
          <div className="pointer-events-none absolute -inset-5 rounded-[2rem] bg-emerald-400/[0.035] blur-2xl" />
          <ThreatGlobe3D compact className="relative shadow-2xl shadow-black/50" />
          <div className="pointer-events-none absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 sm:bottom-7 sm:left-7 sm:right-7">
            <div className="rounded-lg border border-slate-700/80 bg-slate-950/85 px-3 py-2 backdrop-blur">
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">Visualization mode</div>
              <div className="mt-1 text-xs font-medium text-slate-200">Anonymized sample events</div>
            </div>
            <div className="hidden rounded-lg border border-slate-700/80 bg-slate-950/85 px-3 py-2 text-right backdrop-blur sm:block">
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">Rendering</div>
              <div className="mt-1 text-xs font-medium text-emerald-300">Interactive WebGL</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="border-b border-slate-800/80 px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">A calmer way to respond</p>
            <h2 className="font-sans text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              From signal to next step.
            </h2>
          </div>
          <p className="max-w-lg text-sm leading-6 text-slate-400">
            Practical tools for people who want to understand what the data says—and what it doesn’t.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {productPillars.map(({ icon: Icon, number, title, description, color, border }) => (
            <article key={number} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition-colors hover:border-slate-700">
              <div className="mb-8 flex items-center justify-between">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl border ${border} bg-slate-950/70 ${color}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="font-mono text-xs text-slate-600">{number}</span>
              </div>
              <h3 className="text-base font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="border-b border-slate-800/80 bg-slate-950/60 px-6 py-20 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div className="space-y-5">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-300">
            <AlertTriangle className="h-4 w-4" />
            Guided incident response
          </span>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            A checklist for the moment that matters.
          </h2>
          <p className="text-sm leading-6 text-slate-400">
            The containment workspace organizes a 10-step response—from isolating a device to reviewing account recovery. You remain in control of every action.
          </p>
          <button
            onClick={onScanClick}
            className="inline-flex items-center gap-2 rounded-xl border border-rose-400/25 bg-rose-400/[0.08] px-5 py-3 text-sm font-semibold text-rose-200 transition-colors hover:border-rose-300/50 hover:bg-rose-400/[0.14]"
          >
            Open the response workspace
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-7">
          <div className="mb-5 flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <p className="text-sm font-semibold text-white">Containment sequence</p>
              <p className="mt-1 text-xs text-slate-500">A guided checklist—not automated account actions</p>
            </div>
            <Radio className="h-5 w-5 text-emerald-300" />
          </div>
          <div className="space-y-4">
            {[
              'Disconnect and isolate the affected device',
              'Switch to a clean, trusted device',
              'Secure your primary email account',
              'Review and terminate active sessions',
            ].map((step, index) => (
              <div key={step} className="flex items-start gap-3 text-sm">
                <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border font-mono text-[10px] ${index < 3 ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300' : 'border-slate-700 text-slate-500'}`}>
                  {index < 3 ? <CheckCircle2 className="h-3.5 w-3.5" /> : index + 1}
                </span>
                <span className={index < 3 ? 'text-slate-300' : 'text-slate-400'}>{step}</span>
              </div>
            ))}
            <p className="border-t border-slate-800 pt-4 text-xs leading-5 text-slate-500">
              Example checklist state shown for illustration. Your console state is local demo data.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section className="border-b border-slate-800/80 px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.04] p-6">
            <EyeOff className="mb-5 h-5 w-5 text-emerald-300" />
            <h3 className="text-sm font-semibold text-white">Privacy boundaries first</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Secret scanning runs in the browser. If you use a breach range check, the intended flow sends a truncated hash prefix—not the original secret.
            </p>
          </article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <Database className="mb-5 h-5 w-5 text-cyan-300" />
            <h3 className="text-sm font-semibold text-white">Sample data, plainly labeled</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Threat map records and dashboard identities are bundled demo data. No live breach feed or continuous account monitoring is connected.
            </p>
          </article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <GitBranch className="mb-5 h-5 w-5 text-amber-300" />
            <h3 className="text-sm font-semibold text-white">Open to inspection</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Review the architecture and threat model, inspect the implementation, and run the security checks yourself.
            </p>
          </article>
        </div>
      </div>
    </section>

    <section className="px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Built by Ferrivox Ltd</p>
        <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-5xl">
          Iron will. Infinite dreams.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-400">
          SentinelKey is an evolving open-source prototype. Explore the tools, read the threat model, and judge the work by what can be verified.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={onScanClick}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-300 px-6 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-200"
          >
            Open the demo console
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={openDocs}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-6 py-3 text-sm font-medium text-slate-200 transition-colors hover:border-slate-500 hover:bg-slate-900"
          >
            <Lock className="h-4 w-4" />
            Read architecture & threat model
          </button>
        </div>
      </div>
    </section>
  </div>
);
