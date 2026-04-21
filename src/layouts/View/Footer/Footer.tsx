import { ToTop } from "@sito/dashboard-app";
import { useTranslation } from "react-i18next";

const year = new Date().getFullYear();

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="w-full bg-base flex items-center justify-center h-10 relative mb-16 sm:mb-0">
      <p className="text-sm text-text-muted">
        {t("_pages:footer.copyright")} {year}
      </p>
      <ToTop />
    </footer>
  );
}

export default Footer;
