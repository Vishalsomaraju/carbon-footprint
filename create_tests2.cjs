const fs = require('fs');
const path = require('path');

const write = (f, c) => {
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, c);
};

write('src/test/services/mapsService.test.ts', `
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { calculateCommuteEmissions } from '../../services/mapsService';

describe('mapsService', () => {
  beforeEach(() => {
    global.window = {
      google: {
        maps: {
          DistanceMatrixService: vi.fn().mockImplementation(() => ({
            getDistanceMatrix: vi.fn().mockResolvedValue({
              rows: [{ elements: [{ status: 'OK', distance: { value: 15000 }, duration: { value: 1800 } }] }]
            })
          })),
          TravelMode: { DRIVING: 'DRIVING', TRANSIT: 'TRANSIT', BICYCLING: 'BICYCLING', WALKING: 'WALKING' },
          UnitSystem: { METRIC: 'METRIC' }
        }
      }
    } as any;
  });

  it('calculateCommuteEmissions returns correct values', async () => {
    const result = await calculateCommuteEmissions('A', 'B', 'car_petrol_per_km', 5);
    expect(result.distanceKm).toBe(15);
    expect(result.durationMinutes).toBe(30);
  });
});
`);

write('src/test/pages/ProfilePage.test.tsx', `
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { ProfilePage } from '../../pages/ProfilePage';
import { useAuth, useActivities } from '../../hooks';

vi.mock('../../hooks', () => ({
  useAuth: vi.fn(),
  useActivities: vi.fn(),
}));

describe('ProfilePage', () => {
  it('renders profile stats', () => {
    (useAuth as unknown as import("vitest").Mock).mockReturnValue({ user: { displayName: 'John Doe', email: 'john@example.com' } });
    (useActivities as unknown as import("vitest").Mock).mockReturnValue({ activities: [{ carbonImpact: 10, date: new Date().toISOString() }] });

    render(
      <BrowserRouter>
        <ProfilePage />
      </BrowserRouter>
    );
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
`);

write('src/test/pages/InsightsPage.test.tsx', `
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { InsightsPage } from '../../pages/InsightsPage';
import { useActivities } from '../../hooks';
import * as geminiService from '../../services/geminiService';

vi.mock('../../hooks', () => ({
  useActivities: vi.fn(),
}));
vi.mock('../../services/geminiService', () => ({
  generateWeeklyInsights: vi.fn(),
  getReductionChat: vi.fn(),
}));

describe('InsightsPage', () => {
  it('renders insights successfully', async () => {
    (useActivities as unknown as import("vitest").Mock).mockReturnValue({ activities: [{ id: '1', carbonImpact: 10, category: 'transport', date: new Date().toISOString() }], loading: false });
    (geminiService.generateWeeklyInsights as import("vitest").Mock).mockResolvedValue([
      { id: '1', title: 'Tip 1', body: 'Test body', type: 'tip', category: 'general' }
    ]);

    render(
      <BrowserRouter>
        <InsightsPage />
      </BrowserRouter>
    );

    await waitFor(() => expect(screen.getByText('Tip 1')).toBeInTheDocument());
  });
});
`);

write('src/test/pages/CommutePage.test.tsx', `
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { CommutePage } from '../../pages/CommutePage';
import { useActivities } from '../../hooks';
import * as mapsService from '../../services/mapsService';

vi.mock('../../hooks', () => ({
  useActivities: vi.fn(),
}));
vi.mock('../../services/mapsService', () => ({
  calculateCommuteEmissions: vi.fn(),
}));

describe('CommutePage', () => {
  beforeEach(() => {
    (useActivities as unknown as import("vitest").Mock).mockReturnValue({ addActivity: vi.fn() });
    (mapsService.calculateCommuteEmissions as import("vitest").Mock).mockResolvedValue({ distanceKm: 15, durationMinutes: 30, dailyCo2Kg: 5, annualCo2Kg: 1000 });
  });

  it('renders correctly', () => {
    render(
      <BrowserRouter>
        <CommutePage />
      </BrowserRouter>
    );
    expect(screen.getByText(/Smart Commute/i)).toBeInTheDocument();
  });
});
`);

write('src/test/components/ActivityForm.test.tsx', `
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ActivityForm } from '../../components/log/ActivityForm';

describe('ActivityForm', () => {
  it('renders correctly', () => {
    render(<ActivityForm category="transport" onNext={vi.fn()} onBack={vi.fn()} />);
    expect(screen.getByText(/Activity Type/i)).toBeInTheDocument();
  });
});
`);
