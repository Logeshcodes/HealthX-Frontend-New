import { Stethoscope, Hospital, Syringe, HeartPulse } from 'lucide-react';

const links = [
  { name: 'Our Services', href: '#', icon: Stethoscope },
  { name: 'Find a Doctor', href: '#', icon: Hospital },
  { name: 'Health Programs', href: '#', icon: Syringe },
  { name: 'Patient Support', href: '#', icon: HeartPulse },
];

const stats = [
  { name: 'Hospitals Worldwide', value: '50+' },
  { name: 'Qualified Doctors', value: '1000+' },
  { name: 'Patients Served', value: '500K+' },
  { name: '24/7 Support', value: 'Yes' },
];

export default function AboutPage() {
  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-br from-green-700 to-blue-900 py-24 sm:py-32 mt-28">
      <img
        alt="Healthcare background"
        src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=focalpoint&fp-y=.8&w=2830&h=1500&q=80&blend=111827&sat=-100&exp=15&blend-mode=multiply"
        className="absolute inset-0 -z-10 size-full object-cover object-center"
      />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl">Your Health, Our Priority</h2>
          <p className="mt-8 text-lg text-gray-200 sm:text-xl">
            Delivering world-class healthcare services with compassion and innovation. Join us in making a difference every day.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-6 text-base font-semibold text-white sm:grid-cols-2 md:flex lg:gap-x-10">
            {links.map((link) => (
              <a key={link.name} href={link.href} className="flex items-center gap-3 hover:text-gray-200">
                <link.icon className="h-6 w-6 text-teal-400" />
                {link.name} <span aria-hidden="true">→</span>
              </a>
            ))}
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.name} className="flex flex-col-reverse gap-2">
                <dt className="text-base text-gray-300">{stat.name}</dt>
                <dd className="text-4xl font-bold text-white">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
