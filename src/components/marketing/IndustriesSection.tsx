import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import hospitality2 from '../../assets/industries/hospitality-2.jpg';
import construction1 from '../../assets/industries/construction-1.jpg';
import retail1 from '../../assets/industries/retail-1.jpg';
import manufacturing1 from '../../assets/industries/manufacturing-1.jpg';
import logistics1 from '../../assets/industries/logistics-1.jpg';
import agriculture1 from '../../assets/industries/agriculture-1.jpg';
import healthcare1 from '../../assets/industries/healthcare-1.jpg';
import education1 from '../../assets/industries/education-1.jpg';
import bpo1 from '../../assets/industries/bpo-1.jpg';
import financial1 from '../../assets/industries/financial-1.jpg';
import foodbeverage1 from '../../assets/industries/foodbeverage-1.jpg';
import security1 from '../../assets/industries/security-1.jpg';

const INDUSTRIES = [
  {
    name: 'Hospitality',
    description: "Hotels and restaurants run on shifts. See who showed up for breakfast service before the first guest sits down.",
    photo: hospitality2,
  },
  {
    name: 'Construction',
    description: "Your sites are spread across the island. GPS clock-in means you know who's on which site, without driving there.",
    photo: construction1,
  },
  {
    name: 'Retail',
    description: "Multiple shops, rotating staff, weekend rushes. One dashboard shows every store at once.",
    photo: retail1,
  },
  {
    name: 'Manufacturing',
    description: "Shift changeovers, overtime, night teams. Chronix tracks every hour so payroll matches reality.",
    photo: manufacturing1,
  },
  {
    name: 'Logistics',
    description: "Drivers and warehouse teams start early and finish late. Clock-ins from the road, records you can trust.",
    photo: logistics1,
  },
  {
    name: 'Agriculture',
    description: "From field crews to harvesting teams. GPS clock-ins verify attendance across large farms and estates.",
    photo: agriculture1,
  },
  {
    name: 'Healthcare',
    description: "Clinics and care teams can't afford gaps in coverage. Know instantly when a shift isn't filled.",
    photo: healthcare1,
  },
  {
    name: 'Education',
    description: "Teaching and support staff across campuses. Simple attendance, clean records for administration.",
    photo: education1,
  },
  {
    name: 'BPO & ICT',
    description: "Night shifts, split shifts, and 24/7 campaigns. See every seat filled and every hour tracked accurately.",
    photo: bpo1,
  },
  {
    name: 'Financial Services',
    description: "Compliance needs clean records. Every clock-in is timestamped, verified, and export-ready.",
    photo: financial1,
  },
  {
    name: 'Food & Beverage',
    description: "From prep cooks to front-of-house staff. Know who is on shift at every outlet in real time.",
    photo: foodbeverage1,
  },
  {
    name: 'Security Services',
    description: "Guards rotating across different posts. GPS verification confirms that every site is covered.",
    photo: security1,
  },
];

export function IndustriesSection() {
  const revealRef = useScrollReveal<HTMLElement>();
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollTrack = (direction: -1 | 1) => {
    trackRef.current?.scrollBy({ left: direction * 320, behavior: 'smooth' });
  };

  return (
    <section className="section reveal" id="industries" ref={revealRef}>
      <div className="industries-header">
        <div>
          <h2 className="section-title">Industries We Serve</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: 560 }}>
            Chronix is built for teams that clock in on their feet, not at a desk.
          </p>
        </div>
        <div className="industries-carousel-nav">
          <button type="button" className="icon-btn" aria-label="Scroll industries left" onClick={() => scrollTrack(-1)}>
            <ChevronLeft size={20} />
          </button>
          <button type="button" className="icon-btn" aria-label="Scroll industries right" onClick={() => scrollTrack(1)}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div className="industries-carousel-track" ref={trackRef}>
        {INDUSTRIES.map((industry, index) => (
          <div className="industry-card-compact" key={industry.name}>
            <img
              src={industry.photo}
              alt={`${industry.name} workers`}
              loading={index < 3 ? 'eager' : 'lazy'}
            />
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
