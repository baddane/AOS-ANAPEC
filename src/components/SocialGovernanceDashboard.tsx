import React, { useState } from 'react';
import { 
  Calculator, ShieldCheck, Scale, TrendingUp, Coins, Users, CheckCircle2, 
  HelpCircle, Briefcase, Calendar, ChevronRight, Info, Award, UserCheck, Phone, Mail
} from 'lucide-react';
import { UserProfile } from '../types';

interface SocialGovernanceDashboardProps {
  currentUser: UserProfile;
}

export default function SocialGovernanceDashboard({ currentUser }: SocialGovernanceDashboardProps) {
  // Simulator states
  const [gradeGroup, setGradeGroup] = useState<'execution' | 'maitrise' | 'cadre' | 'cadre_sup'>('cadre');
  const [seniority, setSeniority] = useState<number>(5);
  const [maritalStatus, setMaritalStatus] = useState<'single' | 'married'>('married');
  const [childrenCount, setChildrenCount] = useState<number>(2);
  const [lastBenefitYears, setLastBenefitYears] = useState<'never_or_above_3' | '2_years_ago' | 'last_year'>('never_or_above_3');
  const [benefitCategory, setBenefitCategory] = useState<'ESTIVAGE' | 'PRET_SOCIAL' | 'PELLERINAGE'>('ESTIVAGE');

  // Interactive Charter State
  const [isCharterSigned, setIsCharterSigned] = useState(() => {
    return localStorage.getItem(`charter_signed_${currentUser.id}`) === 'true';
  });
  
  // Ombudsman / Recourse states
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketBody, setTicketBody] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState(false);

  // Score Calculation logic reflecting the professional OCP/ONEE barème criteria
  const calculateScore = () => {
    let score = 0;
    const details: { label: string; points: number }[] = [];

    // 1. Social Equality Component (Lower grades get higher priorities)
    let gradePoints = 0;
    let gradeName = '';
    if (gradeGroup === 'execution') { gradePoints = 50; gradeName = 'Exécution (Échelle 1-7)'; }
    else if (gradeGroup === 'maitrise') { gradePoints = 35; gradeName = 'Maîtrise (Échelle 8-9)'; }
    else if (gradeGroup === 'cadre') { gradePoints = 20; gradeName = 'Cadre (Échelle 10-11)'; }
    else if (gradeGroup === 'cadre_sup') { gradePoints = 10; gradeName = 'Cadre Supérieur (Hors Échelle)'; }
    score += gradePoints;
    details.push({ label: `Invert-Revenu (Priorité sociale au grade : ${gradeName})`, points: gradePoints });

    // 2. Seniority (Ancienneté) Component - 2 pts per year, max 40
    const seniorityPoints = Math.min(seniority * 2, 40);
    score += seniorityPoints;
    details.push({ label: `Fidélité & Ancienneté (${seniority} ans à l'ANAPEC • 2 pts/an)`, points: seniorityPoints });

    // 3. Family / Charges Component
    let familyPoints = 0;
    if (maritalStatus === 'married') {
      familyPoints += 10;
      // Children: +5 points per child, capped at 5 children (max 25 pts)
      const childPoints = Math.min(childrenCount * 5, 25);
      familyPoints += childPoints;
    }
    score += familyPoints;
    details.push({ 
      label: `Charges familiales (${maritalStatus === 'married' ? `Marié(e) + ${childrenCount} enfant(s)` : 'Célibataire'})`, 
      points: familyPoints 
    });

    // 4. Recurrence Counterpart (Prioritizes first-timers / unserved members over past beneficiaries)
    let restrictionPoints = 0;
    let restrictionDesc = '';
    if (lastBenefitYears === 'never_or_above_3') { restrictionPoints = 30; restrictionDesc = 'Aucune prestation reçue sur les 3 dernières années'; }
    else if (lastBenefitYears === '2_years_ago') { restrictionPoints = 15; restrictionDesc = 'Dernière prestation reçue il y a 2 ans'; }
    else if (lastBenefitYears === 'last_year') { restrictionPoints = 0; restrictionDesc = 'Bénéficiaire l\'année dernière (Priorité alternance standard)'; }
    score += restrictionPoints;
    details.push({ label: `Alternance Equitable (${restrictionDesc})`, points: restrictionPoints });

    return { total: score, details };
  };

  const { total: totalScore, details: scoreDetails } = calculateScore();

  // Get Priority Status color & text
  const getScorePriority = (score: number) => {
    if (score >= 100) return { label: 'Priorité Absolue (Dossier Élite)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', textLight: 'text-emerald-600', width: 'w-full bg-emerald-500' };
    if (score >= 70) return { label: 'Priorité Élevée (Hautement Éligible)', color: 'text-brand-blue-dark bg-brand-blue-light/50 border-brand-blue/20', textLight: 'text-brand-blue', width: 'w-4/5 bg-brand-blue' };
    if (score >= 45) return { label: 'Priorité Modérée / File d\'attente', color: 'text-amber-800 bg-amber-50 border-amber-200', textLight: 'text-amber-600', width: 'w-3/5 bg-amber-500' };
    return { label: 'Priorité Faible (Alternance active)', color: 'text-slate-600 bg-slate-50 border-slate-200', textLight: 'text-slate-500', width: 'w-2/5 bg-slate-400' };
  };

  const priorityMeta = getScorePriority(totalScore);

  const handleSignCharter = () => {
    localStorage.setItem(`charter_signed_${currentUser.id}`, 'true');
    setIsCharterSigned(true);
  };

  const handleOmbudsmanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketBody) return;

    // Simulate sending dispute to AOS mediator
    const key = `recourses_${currentUser.id}`;
    const rest = localStorage.getItem(key);
    const prev = rest ? JSON.parse(rest) : [];
    const newTicket = {
      id: `rc_${Date.now()}`,
      subject: ticketSubject,
      message: ticketBody,
      submissionDate: new Date().toISOString().substring(0, 10),
      status: 'pending'
    };
    localStorage.setItem(key, JSON.stringify([newTicket, ...prev]));

    setTicketSuccess(true);
    setTicketSubject('');
    setTicketBody('');
    setTimeout(() => setTicketSuccess(false), 6000);
  };

  // Detailed Budget breakdow representing best-in-class social allocation ratios
  const BUDGET_Breakdown = [
    { cat: 'Couverture Médicale Complémentaire', pct: 35, amt: '2 850 000 DH', desc: 'Remboursements optiques, dentaires lourds, hospitalisations et capital décès.' },
    { cat: 'Prêts Sociaux d\'Honneur à 0%', pct: 20, amt: '1 630 000 DH', desc: 'Fonds revolving de prêts de secours remboursables sur salaire sans aucun intérêt.' },
    { cat: 'Estivage, Colonies & Voyage d\'été', pct: 20, amt: '1 630 000 DH', desc: 'Résidences d\'été louées au Maroc (M’diq, Saidia, Agadir) subventionnées à 70%.' },
    { cat: 'Soutien aux Familles & Scolarité', pct: 15, amt: '1 220 000 DH', desc: 'Bourses scolaires de rentrée, primes de réussite académique (bac, enseignement supérieur).' },
    { cat: 'Allocations Sacrées & Fêtes', pct: 8, amt: '650 000 DH', desc: 'Prime annuelle de l\'Aïd Al-Adha et aide exceptionnelle pour le pèlerinage aux lieux saints.' },
    { cat: 'Culture, Club d\'Entreprise & Sport', pct: 2, amt: '163 000 DH', desc: 'Prise en charge partielle d\'abonnements de sport et compétitions sportives inter-branches ANAPEC.' }
  ];

  return (
    <div className="space-y-8 text-left animate-fade-in" id="social-governance-dashboard-wrapper">
      
      {/* Upper informational banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-84 h-84 bg-brand-gold/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 bg-brand-gold/15 text-brand-gold px-3.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase font-mono">
            🛡️ Transparence, Équité & Déontologie
          </div>
          <h2 className="text-xl md:text-2xl font-display font-black tracking-tight text-white">
            Espace Gouvernance & Simulateur d’Éligibilité
          </h2>
          <p className="text-slate-400 text-xs md:text-sm max-w-3xl leading-relaxed">
            Pour garantir un accès équitable de tous les collaborateurs de l’ANAPEC aux subventions et activités sociales, l'AOS s'inspire des ratios de transparence financière des grands comités d'entreprises. Utilisez le simulateur de barème pour calculer vos points de priorité sociale, découvrez la répartition de vos cotisations ou écrivez au médiateur de l'AOS.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Interactive Scoring Simulator and Budget breakdown */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Practice 1 : Point Scoring / Barème d'Aide Simulator */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-xs text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-[radial-gradient(#e2e8f0_1.2px,transparent_1.2px)] [background-size:10px_10px] opacity-25 pointer-events-none" />
            
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-6 col-span-1">
              <div className="w-10 h-10 rounded-xl bg-brand-blue-light/50 text-brand-blue flex items-center justify-center shrink-0">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-slate-900 text-base flex items-center gap-2">
                  <span>Simulateur d’Attribution & Barème Social</span>
                  <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 bg-brand-blue/10 text-brand-blue rounded border border-brand-blue/15 font-bold">Barème Officiel AOS</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Vérifiez instantanément votre score d’éligibilité prioritaire calculé selon la grille éthique votée par le Conseil National.</p>
              </div>
            </div>

            {/* Simulated Inputs Group */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs mb-6">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  <span>Catégorie Socio-Professionnelle (Grade)</span>
                </label>
                <select
                  value={gradeGroup}
                  onChange={(e) => setGradeGroup(e.target.value as any)}
                  className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-brand-blue rounded-xl text-slate-900 font-medium cursor-pointer"
                >
                  <option value="execution">Employé d'Exécution / Secrétaire / Agent (Éch 1 à 7) (+50 pts)</option>
                  <option value="maitrise">Maîtrise / Conseiller Junior / Technicien (Éch 8-9) (+35 pts)</option>
                  <option value="cadre">Cadre / Conseiller Titulaire / Chef de Projets (Éch 10-11) (+20 pts)</option>
                  <option value="cadre_sup">Cadre Supérieur / Conseiller Senior / Direction (Hors Échelle) (+10 pts)</option>
                </select>
                <p className="text-[10px] text-slate-450 italic">Priorité sociale redistributive : les grades à revenus modestes reçoivent un coefficient plus important.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Ancienneté d’exercice à l'ANAPEC</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={seniority}
                    onChange={(e) => setSeniority(Number(e.target.value))}
                    className="flex-1 accent-brand-blue h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                  />
                  <span className="font-mono font-bold bg-slate-100 px-3 py-1.5 rounded-lg border text-slate-800 text-xs shrink-0 w-16 text-center">
                    {seniority} {seniority > 1 ? 'Ans' : 'An'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-450 italic">Valorisation de l'engagement fidèle des agents : +2 points accordés par an (limité à 40 pts max).</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Situation familiale & Enfants</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value as any)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl text-slate-900 font-medium cursor-pointer"
                  >
                    <option value="single">Célibataire (+0 pts)</option>
                    <option value="married">Marié(e) (+10 pts)</option>
                  </select>
                  <select
                    value={childrenCount}
                    disabled={maritalStatus === 'single'}
                    onChange={(e) => setChildrenCount(Number(e.target.value))}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl text-slate-900 font-medium cursor-pointer disabled:opacity-40"
                  >
                    <option value="0">Compte : 0 Enfants (+0 pts)</option>
                    <option value="1">1 Enfant (+5 pts)</option>
                    <option value="2">2 Enfants (+10 pts)</option>
                    <option value="3">3 Enfants (+15 pts)</option>
                    <option value="4">4 Enfants (+20 pts)</option>
                    <option value="5">5 Enfants et + (+25 pts)</option>
                  </select>
                </div>
                <p className="text-[10px] text-slate-450 italic">Soutien aux charges domestiques des foyers : +5 points par enfant scolarisé ou à charge.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1 font-sans">
                  <Scale className="w-3.5 h-3.5 text-slate-400" />
                  <span>Récurence : Date de votre dernier estivage reçu</span>
                </label>
                <select
                  value={lastBenefitYears}
                  onChange={(e) => setLastBenefitYears(e.target.value as any)}
                  className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-brand-blue rounded-xl text-slate-900 font-medium cursor-pointer"
                >
                  <option value="never_or_above_3">Jamais bénéficié OU il y a plus de 3 ans (+30 pts)</option>
                  <option value="2_years_ago">Reçu une prestation d'aide il y a 2 ans (+15 pts)</option>
                  <option value="last_year">Bénéficiaire récemment (l'année dernière) (+0 pts)</option>
                </select>
                <p className="text-[10px] text-slate-450 italic">Favoriser l’alternance : prime de priorité aux collègues n’ayant pas encore d'aide pour limiter le monopole.</p>
              </div>

              <div className="sm:col-span-2 space-y-1.5 pt-1.5 border-t border-slate-100">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 font-semibold">Simuler pour la subvention spécifique :</label>
                <div className="flex flex-wrap gap-2.5">
                  {(['ESTIVAGE', 'PRET_SOCIAL', 'PELLERINAGE'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setBenefitCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        benefitCategory === cat 
                          ? 'bg-brand-blue text-white border-brand-blue shadow-xs' 
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                      }`}
                    >
                      {cat === 'ESTIVAGE' ? '🏖️ Camp d\'Estivage' : cat === 'PRET_SOCIAL' ? '🏦 Prêt Sans Intérêt' : '🕋 Aide Pèlerinage (Hajj)'}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Results Output Block */}
            <div className={`p-5 rounded-2xl border-2 border-dashed ${priorityMeta.color} grid grid-cols-1 md:grid-cols-3 gap-5 items-center`}>
              <div className="md:col-span-2 space-y-2 text-left">
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 font-mono">Votre score d'éligibilité brut</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold font-mono tracking-tight text-slate-900">{totalScore}</span>
                  <span className="text-sm font-semibold text-slate-500">points sur 145</span>
                </div>
                <p className="text-xs font-bold text-slate-800">{priorityMeta.label}</p>
                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                  {totalScore >= 100 
                    ? "Félicitations ! Vous disposez d'un excellent niveau de priorité. Votre dossier d'estivage ou d'aide sera traité au sommet de la pile pour la prochaine session d'affectation."
                    : totalScore >= 70
                    ? "Votre score est très solide. Vous passerez en commission prioritaire de deuxième tour. Soumettez votre dossier complet avec justificatifs."
                    : totalScore >= 45
                    ? "Dossier éligible mais susceptible d'être mis en attente selon les places restantes pour favoriser l'alternance sociale."
                    : "Votre priorité est basse en raison de votre obtention récente ou de votre niveau de cadre. Nous vous invitons à opter pour les conventions partenariats d'hôtels qui sont illimitées."}
                </p>
              </div>

              <div className="p-4 bg-white/80 rounded-xl border border-slate-100 flex flex-col items-center justify-center space-y-3 shrink-0 h-full">
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider text-center">Indicateur Priorité</span>
                
                {/* Visual meter bar */}
                <div className="w-full bg-slate-200 rounded-full h-3 max-w-[120px] overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${priorityMeta.width}`} />
                </div>
                
                <span className={`text-[11px] font-mono font-bold uppercase tracking-wider ${priorityMeta.textLight}`}>
                  {benefitCategory}
                </span>

                <div className="text-[10px] text-center font-bold text-slate-700 bg-slate-100/60 px-2 py-1 rounded border">
                  Plafond : {benefitCategory === 'ESTIVAGE' ? '4 000 DH' : benefitCategory === 'PRET_SOCIAL' ? '20 000 DH' : '10 000 DH'}
                </div>
              </div>
            </div>

            {/* Score Breakdowns toggle list */}
            <details className="mt-4 text-xs group">
              <summary className="text-brand-blue hover:text-brand-blue-dark hover:underline font-bold cursor-pointer flex items-center gap-1 select-none">
                <span>Voir le barème de notation mathématique</span>
                <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
              </summary>
              <div className="mt-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2.5 animate-fade-in text-slate-600">
                <p className="font-bold text-slate-800 mb-1 font-mono">Détails d’agrégation de vos {totalScore} points :</p>
                {scoreDetails.map((det, index) => (
                  <div key={index} className="flex justify-between items-center text-[11px] border-b pb-1.5 last:border-none border-slate-100">
                    <span className="font-semibold text-slate-700">{det.label}</span>
                    <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border">+{det.points} pts</span>
                  </div>
                ))}
              </div>
            </details>

          </div>

          {/* Practice 2 : Transparent Budget Allocation - Live chart analysis */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-xs text-left">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-6 col-span-1">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-brand-gold" />
              </div>
              <div>
                <h3 className="font-display font-bold text-slate-900 text-base flex items-center gap-2">
                  <span>Répartition Consensuelle du Budget de l'AOS</span>
                  <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 bg-emerald-50 text-emerald-800 rounded border border-emerald-100 font-bold">Transparence 100% Audité</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Visibilité totale sur l'affection des cotisations d'adhésion nationale et des subventions d’état.</p>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed mb-6 font-sans">
              Chaque dirham investi par l'association est encadré par les ratios de gouvernance du Conseil National. Voici comment sont allouées les ressources financières globales annuelles (Budget estimé à un total de <strong>8 143 000 DH</strong>) :
            </p>

            {/* Simulated interactive visual bar charts illustrating budget weight */}
            <div className="space-y-4 text-xs font-sans">
              {BUDGET_Breakdown.map((row) => (
                <div key={row.cat} className="space-y-1.5 p-3.5 bg-slate-50 hover:bg-slate-100/50 rounded-2xl border border-slate-100 transition-colors">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-slate-800 font-bold text-xs sm:text-sm">{row.cat}</span>
                    <div className="flex gap-2 items-center">
                      <span className="font-sans font-extrabold text-brand-blue">{row.pct}%</span>
                      <span className="text-[10px] text-slate-400 font-mono">({row.amt})</span>
                    </div>
                  </div>
                  
                  {/* Progress ratio */}
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-brand-blue h-full rounded-full transition-all" 
                      style={{ width: `${row.pct}%` }} 
                    />
                  </div>

                  <p className="text-[10px] text-slate-400 leading-relaxed leading-normal">{row.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 p-4 rounded-xl bg-slate-900 border border-slate-800 text-white flex flex-col sm:flex-row justify-between items-center gap-3 text-left">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-brand-gold flex items-center gap-1">
                  <span>Indice de Redistribution d’Action Directe :</span>
                  <span className="bg-emerald-550 text-[9px] text-white font-mono px-2 py-0.5 rounded-sm bg-emerald-600">Excellent • 95%</span>
                </p>
                <p className="text-[10px] text-slate-400">95% de nos budgets sont reversés directement en secours et subventions des utilisateurs, limitant les coûts de fonctionnement administratif à 5%.</p>
              </div>
              <button 
                onClick={() => alert("Le rapport de certification d'audit externe 2025 est consultable en entier dans le Kiosque ou sous demande au tribunal régional.")}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-white rounded-lg border border-slate-700/80 text-[10px] tracking-wide uppercase font-bold cursor-pointer transition-all"
              >
                Vérifier Audit Externe
              </button>
            </div>

          </div>

        </div>

        {/* Right 1 Col: Ethics Charter Sign-off and Support Ombudsman channel */}
        <div className="space-y-8">
          
          {/* Practice 3 : Digital Ethics & Governance Code Sign-off */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm text-left relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:12px_12px] opacity-25 pointer-events-none" />
            
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                <span className="text-xs font-extrabold text-slate-850 uppercase tracking-widest">Charte d'Éthique & Garanties</span>
              </div>

              <p className="text-xs text-slate-500 leading-normal font-sans">
                Pour promouvoir la justice sociale et une saine écoute, l’AOS de l’ANAPEC applique sans réserve <strong>4 engagements fondamentaux</strong> :
              </p>

              <div className="space-y-3 text-[11px] leading-relaxed">
                
                <div className="flex gap-2 text-slate-700">
                  <div className="text-emerald-600 font-bold">1.</div>
                  <div className="space-y-0.5 text-left">
                    <p className="font-bold text-slate-900">Équité Mathématique</p>
                    <p className="text-slate-500">Aucun passe-droit. Toutes les demandes d'aides à budget limité passent par l'algorithme de barème ci-contre.</p>
                  </div>
                </div>

                <div className="flex gap-2 text-slate-700">
                  <div className="text-emerald-600 font-bold">2.</div>
                  <div className="space-y-0.5 text-left">
                    <p className="font-bold text-slate-900">Confidentialité Intégrale</p>
                    <p className="text-slate-500">Vos pièces médicales (bilans, mutuelles) sont chiffrées de bout-en-bout et consultables uniquement par le Médecin-conseil.</p>
                  </div>
                </div>

                <div className="flex gap-2 text-slate-700">
                  <div className="text-emerald-600 font-bold">3.</div>
                  <div className="space-y-0.5 text-left">
                    <p className="font-bold text-slate-900">Alternance Transparente</p>
                    <p className="text-slate-500">Un délai d’alternance interdit le cumul systématique par les mêmes adhérents pour laisser la chance aux nouveaux.</p>
                  </div>
                </div>

                <div className="flex gap-2 text-slate-700">
                  <div className="text-emerald-600 font-bold">4.</div>
                  <div className="space-y-0.5 text-left">
                    <p className="font-bold text-slate-900">Droit de Contestation</p>
                    <p className="text-slate-500">En cas d'avis non favorable, tout adhérent peut émettre un recours formel direct auprès du Médiateur d'AOS.</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Engagement Sign Option */}
            <div className="mt-6 pt-4 border-t border-slate-100 space-y-3.5">
              {isCharterSigned ? (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-[10px] font-bold flex gap-2 items-center animate-fade-in">
                  <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <p>Charte Éthique Co-Signée ✓</p>
                    <p className="text-[9px] text-emerald-600 font-normal">Vous vous engagez à déclarer avec authenticité vos charges et pièces justificatives.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-center sm:text-left">
                  <p className="text-[10px] text-slate-400">Pour garantir l'intégrité de vos déclarations, veuillez lire et co-signer numériquement la charte d'éthique.</p>
                  <button
                    onClick={handleSignCharter}
                    className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 text-white text-[10px] tracking-wide font-extrabold uppercase rounded-xl transition-all shadow-xs cursor-pointer select-none"
                  >
                    📝 Co-signer la charte d'Ethique
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Practice 4 : Guichet Relais Social - Ombudsman Ticket Recourse desk */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs text-left">
            <div className="pb-3 border-b border-slate-100 flex items-center gap-2 mb-4">
              <Scale className="w-4.5 h-4.5 text-brand-gold shrink-0 mb-0.5" />
              <span className="text-xs font-extrabold text-slate-850 uppercase tracking-widest">Guichet Unique de Recours</span>
            </div>

            <p className="text-xs text-slate-400 leading-normal mb-4 font-sans text-left">
              Une réclamation sur l'historique d’un remboursement ? Un montant accordé non conforme aux promesses ? Envoyez un message confidentiel direct au <strong>Secrétariat de Médiation Sociale</strong>.
            </p>

            {ticketSuccess && (
              <div className="p-3.5 mb-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-[10px] font-bold flex gap-2 items-center animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Recours transmis. Un numéro de saisine sera envoyé sous 48h.</span>
              </div>
            )}

            <form onSubmit={handleOmbudsmanSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Sujet de recours</label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Réclamation montant dossier optique n°302"
                  value={ticketSubject}
                  onChange={e => setTicketSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl focus:bg-white focus:outline-hidden text-[11px]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Exposé circonstancié des faits</label>
                <textarea
                  required
                  rows={3}
                  value={ticketBody}
                  onChange={e => setTicketBody(e.target.value)}
                  placeholder="Spécifiez clairement vos pièces concernées, les dates de rejet, ou votre situation familiale non prise en compte par le calcul d'aide..."
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl focus:bg-white focus:outline-hidden text-[11px]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-brand-blue hover:bg-brand-blue-dark text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-brand-blue/10 cursor-pointer text-center select-none"
              >
                Déposer mon Recours Officiel
              </button>
            </form>

            {/* Regional delegates Contacts block */}
            <div className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-[11px] leading-relaxed">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Délégation Sociale Nationale :</span>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100/50 flex flex-col gap-1 text-[10px] text-slate-600">
                <p className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Phone className="w-3.5 h-3.5 text-brand-blue" />
                  <span>N° Social unique : +212 537 778 899</span>
                </p>
                <p className="flex items-center gap-1.5 pt-0.5">
                  <Mail className="w-3.5 h-3.5 text-brand-blue" />
                  <span className="font-mono underline">mediation.sociale@aosanapec.ma</span>
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
