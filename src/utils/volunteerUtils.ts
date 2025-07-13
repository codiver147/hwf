
import { useLanguage } from "@/contexts/LanguageContext";

export const formatAvailability = (availabilityObj: Record<string, string> | null): string => {
  const { language, t } = useLanguage();
  
  if (!availabilityObj || Object.keys(availabilityObj).length === 0) {
    return t('common.none');
  }
  
  const dayTranslations: Record<string, Record<string, string>> = {
    fr: {
      monday: 'Lundi',
      tuesday: 'Mardi',
      wednesday: 'Mercredi',
      thursday: 'Jeudi',
      friday: 'Vendredi',
      saturday: 'Samedi',
      sunday: 'Dimanche',
      lundi: 'Lundi',
      mardi: 'Mardi',
      mercredi: 'Mercredi',
      jeudi: 'Jeudi',
      vendredi: 'Vendredi',
      samedi: 'Samedi',
      dimanche: 'Dimanche'
    },
    en: {
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      sunday: 'Sunday',
      lundi: 'Monday',
      mardi: 'Tuesday',
      mercredi: 'Wednesday',
      jeudi: 'Thursday',
      vendredi: 'Friday',
      samedi: 'Saturday',
      dimanche: 'Sunday'
    }
  };

  const timeTranslations: Record<string, Record<string, string>> = {
    fr: {
      morning: 'Matin',
      afternoon: 'Après-midi',
      evening: 'Soir',
      'all-day': 'Toute la journée',
      matin: 'Matin',
      'apres-midi': 'Après-midi',
      soir: 'Soir'
    },
    en: {
      morning: 'Morning',
      afternoon: 'Afternoon',
      evening: 'Evening',
      'all-day': 'All day',
      matin: 'Morning',
      'apres-midi': 'Afternoon',
      soir: 'Evening'
    }
  };
  
  return Object.entries(availabilityObj)
    .map(([day, time]) => {
      const translatedDay = dayTranslations[language][day.toLowerCase()] || day;
      const translatedTime = timeTranslations[language][time.toLowerCase()] || time;
      return `${translatedDay}: ${translatedTime}`;
    })
    .join(', ');
};

export const formatSkills = (skills: string[] | any[]): string => {
  const { t } = useLanguage();
  
  if (!skills || !Array.isArray(skills) || skills.length === 0) {
    return t('common.none');
  }
  
  // Handle case where skills might be an array of objects with skill_name property
  if (typeof skills[0] === 'object' && skills[0]?.skill_name) {
    return skills.map(skill => skill.skill_name).join(", ");
  }
  
  // Handle case where skills is simply an array of strings
  return skills.join(", ");
};
