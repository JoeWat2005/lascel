"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ContactModal = dynamic(() => import("./contact-modal"), { ssr: false });
const CONTACT_TRIGGER_SELECTOR = "[data-contact-trigger]";

export default function ContactModalController() {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRenderModal, setShouldRenderModal] = useState(false);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const triggerElement = target.closest(CONTACT_TRIGGER_SELECTOR);
      if (!triggerElement) {
        return;
      }

      event.preventDefault();
      setShouldRenderModal(true);
      setIsOpen(true);
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  if (!shouldRenderModal) {
    return null;
  }

  return <ContactModal isOpen={isOpen} onClose={() => setIsOpen(false)} />;
}
