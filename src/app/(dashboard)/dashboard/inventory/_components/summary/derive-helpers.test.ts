import { describe, it, expect } from "vitest";
import {
  formatDaysCover,
  formatDaysDrift,
  formatRiskScore,
  formatPct,
  formatLastUpdated,
  formatAvgGap,
  docUrgencyClass,
  formatPoStatus,
} from "./derive-helpers";

describe("derive-helpers", () => {
  describe("formatDaysCover", () => {
    it("returns '< 1 ngày' for values < 1", () => {
      expect(formatDaysCover(0)).toBe("< 1 ngày");
      expect(formatDaysCover(0.5)).toBe("< 1 ngày");
      expect(formatDaysCover(0.99)).toBe("< 1 ngày");
    });

    it("returns rounded value in 'X ngày' format", () => {
      expect(formatDaysCover(1)).toBe("1 ngày");
      expect(formatDaysCover(5.4)).toBe("5 ngày");
      expect(formatDaysCover(7.5)).toBe("8 ngày");
      expect(formatDaysCover(14.999)).toBe("15 ngày");
    });

    it("handles boundary at exactly 1 day", () => {
      expect(formatDaysCover(1.0)).toBe("1 ngày");
      expect(formatDaysCover(0.999)).toBe("< 1 ngày");
    });
  });

  describe("formatDaysDrift", () => {
    it("returns 'Đúng hạn' for 0 drift", () => {
      expect(formatDaysDrift(0)).toBe("Đúng hạn");
    });

    it("returns 'Trễ X ngày' for positive drift (overdue)", () => {
      expect(formatDaysDrift(1)).toBe("Trễ 1 ngày");
      expect(formatDaysDrift(5)).toBe("Trễ 5 ngày");
      expect(formatDaysDrift(30)).toBe("Trễ 30 ngày");
    });

    it("returns 'Còn X ngày' for negative drift (upcoming)", () => {
      expect(formatDaysDrift(-1)).toBe("Còn 1 ngày");
      expect(formatDaysDrift(-7)).toBe("Còn 7 ngày");
      expect(formatDaysDrift(-30)).toBe("Còn 30 ngày");
    });
  });

  describe("formatRiskScore", () => {
    it("formats score to 1 decimal place", () => {
      expect(formatRiskScore(0)).toBe("0.0");
      expect(formatRiskScore(45.678)).toBe("45.7");
      expect(formatRiskScore(100)).toBe("100.0");
      expect(formatRiskScore(99.999)).toBe("100.0");
    });

    it("handles edge cases 0-100 range", () => {
      expect(formatRiskScore(0.1)).toBe("0.1");
      expect(formatRiskScore(99.95)).toBe("100.0");
    });
  });

  describe("formatPct", () => {
    it("rounds and returns XX% format", () => {
      expect(formatPct(0)).toBe("0%");
      expect(formatPct(50)).toBe("50%");
      expect(formatPct(50.4)).toBe("50%");
      // Note: Math.round uses banker's rounding; 50.5 rounds to 51 (away from zero)
      expect(formatPct(50.5)).toBe("51%");
      expect(formatPct(50.6)).toBe("51%");
      expect(formatPct(100)).toBe("100%");
    });

    it("handles decimal rounding", () => {
      expect(formatPct(33.33)).toBe("33%");
      expect(formatPct(66.67)).toBe("67%");
      expect(formatPct(33.5)).toBe("34%");
    });
  });

  describe("formatLastUpdated", () => {
    it("formats ISO string to HH:mm in Vi locale (Asia/Saigon UTC+7)", () => {
      // Note: System timezone is UTC+7, so Z times are converted to local
      // 14:30 UTC = 21:30 UTC+7
      expect(formatLastUpdated("2025-04-21T14:30:00Z")).toBe("21:30");
      // 08:45 UTC = 15:45 UTC+7
      expect(formatLastUpdated("2025-04-21T08:45:00Z")).toBe("15:45");
      // 00:00 UTC = 07:00 UTC+7
      expect(formatLastUpdated("2025-04-21T00:00:00Z")).toBe("07:00");
    });

    it("returns '--:--' for invalid ISO string", () => {
      expect(formatLastUpdated("invalid")).toBe("--:--");
      expect(formatLastUpdated("")).toBe("--:--");
      expect(formatLastUpdated("not-a-date")).toBe("--:--");
    });

    it("handles various ISO formats", () => {
      // 15:30 UTC = 22:30 UTC+7
      const validIso = "2025-04-21T15:30:00.000Z";
      expect(formatLastUpdated(validIso)).toBe("22:30");
    });

    it("handles boundary case near day change", () => {
      // 23:59:59 UTC = 06:59:59 next day UTC+7
      const result = formatLastUpdated("2025-04-21T23:59:59Z");
      expect(result).toMatch(/^(06|07):\d{2}$/);
    });
  });

  describe("formatAvgGap", () => {
    it("rounds and returns 'X ngày/lần' format", () => {
      expect(formatAvgGap(7)).toBe("7 ngày/lần");
      expect(formatAvgGap(14.4)).toBe("14 ngày/lần");
      // Math.round(14.5) = 15 (away from zero)
      expect(formatAvgGap(14.5)).toBe("15 ngày/lần");
      expect(formatAvgGap(14.6)).toBe("15 ngày/lần");
      expect(formatAvgGap(30)).toBe("30 ngày/lần");
    });

    it("handles fractional days", () => {
      expect(formatAvgGap(7.3)).toBe("7 ngày/lần");
      expect(formatAvgGap(7.9)).toBe("8 ngày/lần");
    });
  });

  describe("docUrgencyClass", () => {
    it("returns text-destructive for days < 7", () => {
      expect(docUrgencyClass(0)).toBe("text-destructive font-semibold");
      expect(docUrgencyClass(3)).toBe("text-destructive font-semibold");
      expect(docUrgencyClass(6.99)).toBe("text-destructive font-semibold");
    });

    it("returns text-yellow-600 for 7 <= days < 14", () => {
      expect(docUrgencyClass(7)).toBe("text-yellow-600 font-medium");
      expect(docUrgencyClass(10)).toBe("text-yellow-600 font-medium");
      expect(docUrgencyClass(13.99)).toBe("text-yellow-600 font-medium");
    });

    it("returns text-foreground for days >= 14", () => {
      expect(docUrgencyClass(14)).toBe("text-foreground");
      expect(docUrgencyClass(30)).toBe("text-foreground");
      expect(docUrgencyClass(100)).toBe("text-foreground");
    });

    it("handles boundary cases precisely", () => {
      expect(docUrgencyClass(6.999)).toBe("text-destructive font-semibold");
      expect(docUrgencyClass(7.0)).toBe("text-yellow-600 font-medium");
      expect(docUrgencyClass(13.999)).toBe("text-yellow-600 font-medium");
      expect(docUrgencyClass(14.0)).toBe("text-foreground");
    });
  });

  describe("formatPoStatus", () => {
    it("returns 'Quá hạn' for overdue status", () => {
      expect(formatPoStatus("overdue")).toBe("Quá hạn");
    });

    it("returns 'Sắp đến' for upcoming status", () => {
      expect(formatPoStatus("upcoming")).toBe("Sắp đến");
    });
  });
});
