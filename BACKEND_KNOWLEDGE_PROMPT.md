# 🎯 **FRONTEND INTEGRATION PROMPT FOR BUZZ FUN CREATOR CREDIT RATING**

Copy and paste this entire prompt to your frontend repository's Windsurf Cascade:

---

## 📋 **PROJECT CONTEXT**

I'm working on the **Buzz Fun Creator Credit Rating** frontend that needs to integrate with a fully functional backend. The backend is a creator credit rating system for Farcaster creators that provides traditional credit scores (like financial credit ratings) but for social media creators.

### **Current Status:**

- ✅ **Backend is COMPLETE** and deployed at: `https://buzzfunbackend.buzzdotfun.workers.dev`
- ✅ **100+ real creator profiles** with diverse scores across all tiers
- ✅ **Optimized caching system** (1-week score cache, daily leaderboard cache)
- ❌ **Frontend is outdated** - currently shows random/mock scores, needs real backend integration

## 🏗️ **BACKEND SYSTEM OVERVIEW**

### **Credit Rating System:**

- **Score Range:** 0-100 (like traditional credit scores)
- **Tiers:** D, C, B, BB, BBB, A, AA, AAA (like bond ratings)
- **5 Core Metrics:** Engagement (25%), Consistency (20%), Growth (20%), Quality (25%), Network (10%)

### **Tier Breakdown:**

- **AAA (90-100):** Exceptional (Top 1%) - Perfect creators
- **AA (80-89):** Excellent (Top 5%) - High-quality creators  
- **A (70-79):** Very Good (Top 15%) - Strong performers
- **BBB (60-69):** Good (Top 35%) - Solid creators
- **BB (50-59):** Fair (Top 60%) - Average performers
- **B (40-49):** Below Average (Top 80%) - Developing creators
- **C (30-39):** Poor (Top 95%) - Low engagement
- **D (0-29):** Very Poor (Bottom 5%) - Inactive/new accounts

## 🔗 **BACKEND API ENDPOINTS**

### **1. Get Creator Score**

```
GET https://buzzfunbackend.buzzdotfun.workers.dev/api/score/creator/:fid
```

**Response:**

```json
{
  "success": true,
  "data": {
    "fid": 12,
    "overallScore": 75.26,
    "tier": "A",
    "tierInfo": {
      "tier": "A",
      "minScore": 70,
      "maxScore": 79,
      "description": "Very Good",
      "percentile": "Top 15%"
    },
    "percentileRank": 85,
    "components": {
      "engagement": 72.5,
      "consistency": 88.2,
      "growth": 65.8,
      "quality": 79.1,
      "network": 82.3
    },
    "timestamp": "2025-08-31T10:30:00.000Z",
    "validUntil": "2025-09-07T10:30:00.000Z"
  }
}
```

### **2. Get Leaderboard (Top 50)**

```
GET https://buzzfunbackend.buzzdotfun.workers.dev/api/leaderboard
```

**Response:**

```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "fid": 10,
        "overallScore": 100,
        "tier": "AAA",
        "tierInfo": { /* tier info */ },
        "percentileRank": 99,
        "components": { /* 5 component scores */ },
        "timestamp": "2025-08-31T10:30:00.000Z"
      }
      // ... up to 50 creators
    ],
    "total": 50,
    "generatedAt": "2025-08-31T10:30:00.000Z",
    "cacheDate": "2025-08-31"
  }
}
```

## 🎯 **FRONTEND INTEGRATION TASKS**

### **Priority 1: Replace Mock Data**

1. **Remove all random/mock score generation**
2. **Integrate real API calls** to backend endpoints
3. **Handle loading states** and error cases
4. **Implement proper caching** (responses are already cached on backend)

### **Priority 2: UI Components**

1. **Score Display:**
   - Score gauge/progress bar (0-100 scale)
   - Tier badge with color coding
   - Percentile rank display
   - Component breakdown (radar chart or bars)

2. **Leaderboard:**
   - Top 50 creators table
   - Rank, FID, Score, Tier columns
   - Pagination or infinite scroll
   - Search/filter functionality

3. **Color Scheme for Tiers:**
   - **AAA/AA/A:** Green shades (excellent)
   - **BBB/BB:** Blue shades (good/fair)
   - **B:** Yellow (below average)
   - **C:** Orange (poor)
   - **D:** Red (very poor)

### **Priority 3: Performance**

1. **Cache API responses** locally for better UX
2. **Implement loading skeletons** for better perceived performance
3. **Handle offline scenarios** gracefully
4. **Optimize for mobile** (lightweight, fast loading)

## 📱 **SAMPLE INTEGRATION CODE**

```javascript
// API service
const API_BASE = 'https://buzzfunbackend.buzzdotfun.workers.dev/api';

export const getCreatorScore = async (fid) => {
  try {
    const response = await fetch(`${API_BASE}/score/creator/${fid}`);
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Failed to fetch creator score:', error);
    return null;
  }
};

export const getLeaderboard = async () => {
  try {
    const response = await fetch(`${API_BASE}/leaderboard`);
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    return null;
  }
};

// Tier color mapping
export const getTierColor = (tier) => {
  const colors = {
    'AAA': '#10B981', // Green
    'AA': '#059669',  // Dark Green
    'A': '#047857',   // Darker Green
    'BBB': '#3B82F6', // Blue
    'BB': '#1D4ED8',  // Dark Blue
    'B': '#F59E0B',   // Yellow
    'C': '#F97316',   // Orange
    'D': '#EF4444'    // Red
  };
  return colors[tier] || '#6B7280';
};
```

## 🔍 **TESTING DATA**

### **Known Good FIDs for Testing:**

- **FID 10:** 100.0 (AAA) - Perfect score
- **FID 2:** 76.11 (A) - Very Good
- **FID 12:** 75.26 (A) - Very Good
- **FID 88:** 74.93 (A) - Very Good
- **FID 22:** 64.3 (BBB) - Good
- **FID 70:** 51.8 (BB) - Fair
- **FID 97:** 44.0 (B) - Below Average
- **FID 367:** 32.7 (C) - Poor
- **FID 11:** 15.4 (D) - Very Poor

### **Invalid FIDs for Error Testing:**

- **FID 999999:** Should return error
- **FID 0:** Should return error
- **FID abc:** Should return error

## 🎨 **UI/UX REQUIREMENTS**

### **Modern Design:**

- **Clean, minimal interface** with focus on data visualization
- **Responsive design** for mobile and desktop
- **Smooth animations** for score changes and loading
- **Dark/light mode support** (optional)

### **Key User Flows:**

1. **Search creator by FID** → Show individual score breakdown
2. **Browse leaderboard** → See top performers with rankings
3. **Compare creators** → Side-by-side score comparison (optional)
4. **Share results** → Shareable links or images (optional)

## 🚨 **IMPORTANT NOTES**

1. **Backend is production-ready** - no need to modify backend code
2. **Responses are cached** - safe to call APIs frequently
3. **100+ real users** in database with diverse score distribution
4. **All tiers represented** - you'll see real AAA, A, B, C, D tier users
5. **Error handling** - always check `success` field in API responses
6. **Performance** - backend responses are ~170ms (cached) vs ~2s (fresh)

## 🎯 **SUCCESS CRITERIA**

✅ **Replace all mock data** with real backend API calls  
✅ **Display accurate scores** for real Farcaster creators  
✅ **Show functional leaderboard** with top 50 creators  
✅ **Implement proper error handling** for invalid FIDs  
✅ **Create beautiful UI** with tier-based color coding  
✅ **Ensure mobile responsiveness** and fast loading  
