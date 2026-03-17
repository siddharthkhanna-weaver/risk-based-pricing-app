import { BASE_RATE_GRID, BRANCH_CATEGORIES } from '../data/pricingRules';
import '../styles/PricingGrid.css';

const PROFILES = Object.keys(BASE_RATE_GRID);
const PRODUCTS = ['Home Loan', 'Non Home Loan'];
const CATEGORIES = BRANCH_CATEGORIES.map((bc) => bc.value);

export default function PricingGrid() {
  return (
    <div className="pricing-grid-wrapper">
      <div className="pricing-grid-scroll">
        <table className="pricing-grid">
          <thead>
            <tr>
              <th rowSpan={2}>Customer Profile</th>
              <th colSpan={3}>Home Loan</th>
              <th colSpan={3}>Non Home Loan</th>
            </tr>
            <tr>
              {PRODUCTS.flatMap((p) =>
                CATEGORIES.map((cat) => (
                  <th key={`${p}-${cat}`}>{cat}</th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {PROFILES.map((profile) => (
              <tr key={profile}>
                <td className="profile-cell">{profile}</td>
                {PRODUCTS.flatMap((prod) =>
                  CATEGORIES.map((cat) => {
                    const grid = BASE_RATE_GRID[profile]?.[prod];
                    const rate = grid?.[cat];
                    return (
                      <td key={`${prod}-${cat}`} className={rate == null ? 'na-cell' : 'rate-cell'}>
                        {rate != null ? `${rate.toFixed(2)}%` : 'N/A'}
                      </td>
                    );
                  })
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
