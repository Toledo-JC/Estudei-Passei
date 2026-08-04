import { getAnalytics, logEvent, isSupported, Analytics } from 'firebase/analytics';
import { auth } from './firebase';

let analyticsPromise: Promise<Analytics | null> | null = null;

export async function getAnalyticsInstance(): Promise<Analytics | null> {
  if (typeof window === 'undefined') return null;
  if (!analyticsPromise) {
    analyticsPromise = isSupported().then((supported) => {
      if (supported) {
        // Initialize standard Firebase Analytics instance
        return getAnalytics();
      }
      return null;
    }).catch(() => null);
  }
  return analyticsPromise;
}

// Custom Event Types Definition
export interface AnalyticsEventMap {
  onboarding_complete: {
    family_id: string;
    parents_count: number;
    students_count: number;
    invite_source: 'whatsapp' | 'direct_code' | 'organic';
  };
  study_session_start: {
    student_uid: string;
    subject_id: string;
    subject_name: string;
    method: 'pomodoro' | 'free_timer' | 'manual';
    target_duration_minutes: number;
  };
  study_session_complete: {
    student_uid: string;
    subject_id: string;
    subject_name: string;
    duration_minutes: number;
    quality_rating: number; // 1-5
    questions_solved?: number;
    questions_correct?: number;
    has_notes: boolean;
  };
  agreement_created: {
    family_id: string;
    created_by_role: 'parent' | 'student';
    daily_goal_minutes: number;
    allowed_breaks_count: number;
    reward_description?: string;
  };
  agreement_accepted: {
    family_id: string;
    student_uid: string;
    days_to_accept: number;
  };
  diagnostic_generated: {
    student_uid: string;
    learning_index: number;
    topics_at_risk_count: number;
    strongest_subject: string;
    weakest_subject: string;
  };
  challenge_created: {
    family_id: string;
    challenge_type: 'streak' | 'hours' | 'quizzes';
    target_value: number;
    duration_days: number;
  };
  challenge_completed: {
    family_id: string;
    challenge_type: string;
    winner_student_uid: string;
    total_participants: number;
  };
  evaluation_created: {
    evaluation_id: string;
    subject_id: string;
    topics_count: number;
    period_index: number;
    auto_generated_plan: boolean;
  };
  exam_plan_generated: {
    evaluation_id: string;
    tasks_generated_count: number;
    spaced_revisions_count: number;
  };
  exam_score_registered: {
    evaluation_id: string;
    subject_id: string;
    score: number;
    max_score: number;
    passed: boolean;
  };
  recovery_mode_activated: {
    evaluation_id: string;
    subject_id: string;
    failing_topics_count: number;
  };
  recovery_completed: {
    evaluation_id?: string;
    subject_id: string;
    topic_id?: string;
  };
}

// Generic strongly-typed track function
export async function trackEvent<K extends keyof AnalyticsEventMap>(
  eventName: K,
  eventParams: AnalyticsEventMap[K]
): Promise<void> {
  try {
    const analytics = await getAnalyticsInstance();
    const currentUserId = auth.currentUser?.uid || 'anonymous';
    
    const enrichedParams = {
      ...eventParams,
      user_id: currentUserId,
      timestamp: new Date().toISOString(),
      platform: 'web_pwa'
    };

    if (analytics) {
      logEvent(analytics, eventName as string, enrichedParams);
    }
    
    // Log to dev console in non-production for easy QA debugging
    if ((import.meta as any).env?.DEV) {
      console.log(`[Firebase Analytics] 📊 Event: ${String(eventName)}`, enrichedParams);
    }
  } catch (error) {
    console.warn('[Analytics Error]', error);
  }
}
