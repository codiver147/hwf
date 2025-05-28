
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-5xl font-bold mb-4 text-hwf-purple">404</h1>
        <p className="text-xl text-gray-700 mb-4">{t('pages.notFound.title')}</p>
        <p className="text-gray-600 mb-6">
          {t('pages.notFound.description')}
        </p>
        <Link to="/">
          <Button className="bg-hwf-purple hover:bg-hwf-purple-dark">
            <Home className="h-4 w-4 mr-2" />
            {t('header.backHome')}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
