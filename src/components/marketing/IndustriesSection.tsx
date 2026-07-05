import hospitality1 from '../../assets/industries/hospitality-1.jpg';
import hospitality2 from '../../assets/industries/hospitality-2.jpg';
import hospitality3 from '../../assets/industries/hospitality-3.jpg';
import construction1 from '../../assets/industries/construction-1.jpg';
import construction2 from '../../assets/industries/construction-2.jpg';
import construction3 from '../../assets/industries/construction-3.jpg';
import retail1 from '../../assets/industries/retail-1.jpg';
import retail2 from '../../assets/industries/retail-2.jpg';
import retail3 from '../../assets/industries/retail-3.jpg';
import manufacturing1 from '../../assets/industries/manufacturing-1.jpg';
import manufacturing2 from '../../assets/industries/manufacturing-2.jpg';
import manufacturing3 from '../../assets/industries/manufacturing-3.jpg';
import logistics1 from '../../assets/industries/logistics-1.jpg';
import logistics2 from '../../assets/industries/logistics-2.jpg';
import logistics3 from '../../assets/industries/logistics-3.jpg';

const INDUSTRIES = [
  {
    name: 'Hospitality',
    description: 'Front desk, kitchen, and housekeeping teams run on shifts. See who is in, at every property.',
    photos: [hospitality2, hospitality1, hospitality3],
  },
  {
    name: 'Construction',
    description: 'Know who is on site before the first pour. GPS check-ins built for crews in the field.',
    photos: [construction1, construction2, construction3],
  },
  {
    name: 'Retail',
    description: 'Cover every till and shop-floor shift, whether you run one store or ten.',
    photos: [retail1, retail2, retail3],
  },
  {
    name: 'Manufacturing',
    description: 'From textile lines to production floors, keep every shift staffed and every hour counted.',
    photos: [manufacturing1, manufacturing2, manufacturing3],
  },
  {
    name: 'Logistics',
    description: 'Drivers, pickers, and warehouse crews — tracked wherever the work happens.',
    photos: [logistics1, logistics2, logistics3],
  },
];

export function IndustriesSection() {
  return (
    <section className="section" id="industries">
      <h2 className="section-title">Industries We Serve</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2rem', maxWidth: 560 }}>
        Chronix is built for teams that clock in on their feet, not at a desk.
      </p>
      <div className="industries-grid">
        {INDUSTRIES.map((industry) => (
          <div className="industry-card" key={industry.name}>
            <div className="industry-photos">
              <img className="industry-photo-hero" src={industry.photos[0]} alt={`${industry.name} workers`} loading="lazy" />
              <div className="industry-thumbs">
                <img src={industry.photos[1]} alt="" loading="lazy" />
                <img src={industry.photos[2]} alt="" loading="lazy" />
              </div>
            </div>
            <div className="industry-card-body">
              <h3 style={{ fontSize: '1.05rem', marginBottom: '0.4rem' }}>{industry.name}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{industry.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
