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
    description: 'Front desk, kitchen, and housekeeping teams run on shifts. See who is in, at every property.',
    photo: hospitality2,
  },
  {
    name: 'Construction',
    description: 'Know who is on site before the first pour. GPS check-ins built for crews in the field.',
    photo: construction1,
  },
  {
    name: 'Retail',
    description: 'Cover every till and shop-floor shift, whether you run one store or ten.',
    photo: retail1,
  },
  {
    name: 'Manufacturing',
    description: 'From textile lines to production floors, keep every shift staffed and every hour counted.',
    photo: manufacturing1,
  },
  {
    name: 'Logistics',
    description: 'Drivers, pickers, and warehouse crews — tracked wherever the work happens.',
    photo: logistics1,
  },
  {
    name: 'Agriculture',
    description: 'From cane fields to tea estates, know your field teams are in before the morning cut.',
    photo: agriculture1,
  },
  {
    name: 'Healthcare',
    description: 'Clinics and pharmacies never really close. Keep every shift covered, day and night.',
    photo: healthcare1,
  },
  {
    name: 'Education',
    description: 'Teachers, tutors, and support staff — one register across every campus and classroom.',
    photo: education1,
  },
  {
    name: 'BPO & ICT',
    description: 'Night shifts and split shifts are the norm. See every seat filled, on every campaign.',
    photo: bpo1,
  },
  {
    name: 'Financial Services',
    description: 'Branches, back office, and client teams — accurate hours without chasing timesheets.',
    photo: financial1,
  },
  {
    name: 'Food & Beverage',
    description: 'From prep to last order, know who is behind the counter at every outlet.',
    photo: foodbeverage1,
  },
  {
    name: 'Security Services',
    description: 'Guards rotate around the clock and across sites. Confirm every post is covered, with GPS proof.',
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
