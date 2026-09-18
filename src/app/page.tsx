'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { ReviewerTour } from '@/components/ReviewerTour';
import { ClinikoTaskMatrix } from '@/components/ClinikoTaskMatrix';
import { ClinikoPipeline } from '@/components/ClinikoPipeline';
import { SoapNoteCopilot } from '@/components/SoapNoteCopilot';
import { PatientIntakeTriage } from '@/components/PatientIntakeTriage';
import { PatientRecallEngine } from '@/components/PatientRecallEngine';
import { ClinikoApiHub } from '@/components/ClinikoApiHub';
import { BentoGrid } from '@/components/BentoGrid';
import { RoiCostCalculator } from '@/components/RoiCostCalculator';
import { BlueprintExporter } from '@/components/BlueprintExporter';
import { ChaosSimulatorModal } from '@/components/ChaosSimulatorModal';
import { AiGovernanceDrawer } from '@/components/AiGovernanceDrawer';
import { ExecutionLogDrawer } from '@/components/ExecutionLogDrawer';
import { CommandMenu } from '@/components/CommandMenu';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  const [activeSection, setActiveSection] = useState('briefing');
  const [chaosModalOpen, setChaosModalOpen] = useState(false);
  const [governanceDrawerOpen, setGovernanceDrawerOpen] = useState(false);
  const [logsDrawerOpen, setLogsDrawerOpen] = useState(false);
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);

  // Anti-flicker programmatic navigation lock
  const isNavigatingRef = useRef(false);
  const navTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleNavigate = (sectionId: string) => {
    // 1. Immediately pin target active state so the clicked menu item illuminates instantly
    setActiveSection(sectionId);

    // 2. Lock observer updates so intermediate sections during smooth scrolling cannot cause menu flickering
    isNavigatingRef.current = true;
    if (navTimeoutRef.current) {
      clearTimeout(navTimeoutRef.current);
    }

    if (sectionId === 'briefing') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        const headerOffset = 64; // Sticky header height allowance
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = Math.max(0, elementPosition + window.scrollY - headerOffset);
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }

    // 3. Release observer lock once smooth scroll completes
    const releaseLock = () => {
      isNavigatingRef.current = false;
      window.removeEventListener('scrollend', releaseLock);
    };

    if ('onscrollend' in window) {
      window.addEventListener('scrollend', releaseLock, { once: true });
    }

    // Fallback timer (1400ms covers full-page smooth-scroll curve)
    navTimeoutRef.current = setTimeout(releaseLock, 1400);
  };

  useEffect(() => {
    const sectionIds = ['briefing', 'matrix', 'pipeline', 'soap', 'intake', 'recall', 'cliniko-api', 'metrics', 'roi', 'blueprints'];
    const observer = new IntersectionObserver(
      (entries) => {
        if (isNavigatingRef.current) return;

        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          visibleEntries.sort(
            (a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top)
          );
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      { rootMargin: '-15% 0px -60% 0px', threshold: 0.1 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
      if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-text-primary)]">
      <Header
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenChaosModal={() => setChaosModalOpen(true)}
        onOpenGovernanceDrawer={() => setGovernanceDrawerOpen(true)}
        onOpenLogsDrawer={() => setLogsDrawerOpen(true)}
        onOpenCommandMenu={() => setCommandMenuOpen(true)}
      />

      <main className="w-full max-w-full min-w-0 overflow-x-hidden">
        <div className="mx-auto max-w-7xl xl:max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 space-y-8">
          <section id="briefing" className="scroll-mt-20">
            <ReviewerTour
              onNavigate={handleNavigate}
              onOpenChaosModal={() => setChaosModalOpen(true)}
            />
          </section>

          <section id="matrix" className="scroll-mt-20">
            <ClinikoTaskMatrix />
          </section>

          <section id="pipeline" className="scroll-mt-20">
            <ClinikoPipeline />
          </section>

          <section id="soap" className="scroll-mt-20">
            <SoapNoteCopilot />
          </section>

          <section id="intake" className="scroll-mt-20">
            <PatientIntakeTriage />
          </section>

          <section id="recall" className="scroll-mt-20">
            <PatientRecallEngine />
          </section>

          <section id="cliniko-api" className="scroll-mt-20">
            <ClinikoApiHub />
          </section>

          <section id="metrics" className="scroll-mt-20">
            <BentoGrid />
          </section>

          <section id="roi" className="scroll-mt-20">
            <RoiCostCalculator />
          </section>

          <section id="blueprints" className="scroll-mt-20">
            <BlueprintExporter />
          </section>
        </div>
      </main>

      <Footer />

      <ChaosSimulatorModal
        open={chaosModalOpen}
        onOpenChange={setChaosModalOpen}
      />

      <AiGovernanceDrawer
        open={governanceDrawerOpen}
        onOpenChange={setGovernanceDrawerOpen}
      />

      <ExecutionLogDrawer
        open={logsDrawerOpen}
        onOpenChange={setLogsDrawerOpen}
      />

      <CommandMenu
        open={commandMenuOpen}
        onOpenChange={setCommandMenuOpen}
        onOpenChaos={() => {
          setCommandMenuOpen(false);
          setChaosModalOpen(true);
        }}
        onOpenGovernance={() => {
          setCommandMenuOpen(false);
          setGovernanceDrawerOpen(true);
        }}
        onOpenLogs={() => {
          setCommandMenuOpen(false);
          setLogsDrawerOpen(true);
        }}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
