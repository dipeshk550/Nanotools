import {
  FiEdit3, FiFileText, FiCheckCircle, FiCode, FiGlobe, FiMail, FiBookOpen,
  FiTrendingUp, FiClipboard, FiHash, FiZap, FiPackage, FiLink, FiScissors,
  FiImage, FiLock, FiMaximize2, FiSearch, FiKey, FiType, FiGitPullRequest,
  FiPercent, FiRefreshCw, FiGrid, FiAward, FiTag, FiVideo, FiMusic,
  FiDollarSign, FiBriefcase, FiHome, FiGrid as FiDashboard, FiSettings,
  FiBookmark, FiClock, FiUsers, FiCpu, FiUpload, FiPlay, FiPlus, FiX,
  FiCopy, FiDownload, FiArrowDown, FiArrowRight, FiSend, FiShield,
  FiCloud, FiChevronDown, FiStar, FiTrendingDown, FiAlertCircle, FiAlertTriangle,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

export const ICONS = {
  FiEdit3, FiFileText, FiCheckCircle, FiCode, FiGlobe, FiMail, FiBookOpen,
  FiTrendingUp, FiClipboard, FiHash, FiZap, FiPackage, FiLink, FiScissors,
  FiImage, FiLock, FiMaximize2, FiSearch, FiKey, FiType, FiGitPullRequest,
  FiPercent, FiRefreshCw, FiGrid, FiAward, FiTag, FiVideo, FiMusic,
  FiDollarSign, FiBriefcase, FiHome, FiDashboard, FiSettings,
  FiBookmark, FiClock, FiUsers, FiCpu, FiUpload, FiPlay, FiPlus, FiX,
  FiCopy, FiDownload, FiArrowDown, FiArrowRight, FiSend, FiShield,
  FiCloud, FiChevronDown, FiStar, FiTrendingDown, FiAlertCircle, FiAlertTriangle, HiSparkles,
};

/** Resolve an icon by its string name. Falls back to FiZap if missing. */
export default function Icon({ name, className = "", size }) {
  const Component = ICONS[name] || FiZap;
  return <Component className={className} size={size} />;
}
