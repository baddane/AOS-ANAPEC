/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BoardMember, BoardMemberCategory } from '../types';
import { useLang } from '../i18n';
import { Users, Mail, Phone, MapPin, Building2, Landmark } from 'lucide-react';

interface BoardDirectoryProps {
  members: BoardMember[];
}

const MemberCard: React.FC<{ member: BoardMember }> = ({ member }) => {
  const initials = member.fullName
    .split(' ')
    .map(p => p.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xs hover:shadow-md hover:border-brand-blue/30 transition-all overflow-hidden flex flex-col">
      <div className="bg-gradient-to-br from-brand-blue-deep to-brand-blue h-20 relative">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:14px_14px]" />
      </div>
      <div className="px-5 pb-5 -mt-12 flex flex-col items-center text-center flex-1">
        {member.photoUrl ? (
          <img
            src={member.photoUrl}
            alt={member.fullName}
            referrerPolicy="no-referrer"
            className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md bg-slate-100"
          />
        ) : (
          <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-md bg-brand-blue-light flex items-center justify-center">
            <span className="text-2xl font-extrabold text-brand-blue-dark">{initials}</span>
          </div>
        )}
        <h4 className="font-display font-bold text-slate-900 text-base mt-3">{member.fullName}</h4>
        <span className="mt-1 inline-block px-3 py-1 bg-brand-gold-light text-brand-gold-dark text-xs font-bold rounded-full">
          {member.role}
        </span>

        {member.delegation && (
          <p className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {member.delegation}
          </p>
        )}

        {member.bio && (
          <p className="mt-3 text-xs text-slate-500 leading-relaxed line-clamp-4">{member.bio}</p>
        )}

        {(member.email || member.phone) && (
          <div className="mt-auto pt-4 w-full flex flex-col gap-1.5 text-xs text-slate-600">
            {member.email && (
              <a href={`mailto:${member.email}`} className="flex items-center justify-center gap-1.5 hover:text-brand-blue transition-colors">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono truncate">{member.email}</span>
              </a>
            )}
            {member.phone && (
              <span className="flex items-center justify-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono">{member.phone}</span>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Section: React.FC<{
  icon: React.ReactNode;
  title: string;
  desc: string;
  count: number;
  members: BoardMember[];
  emptyLabel: string;
  membersLabel: string;
}> = ({
  icon,
  title,
  desc,
  count,
  members,
  emptyLabel,
  membersLabel,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-start">
        <div className="p-2.5 bg-brand-blue-light text-brand-blue rounded-2xl shrink-0">{icon}</div>
        <div>
          <h3 className="font-display font-bold text-slate-900 text-lg flex items-center gap-2">
            {title}
            <span className="text-xs font-semibold text-slate-400">({count} {membersLabel})</span>
          </h3>
          <p className="text-xs text-slate-500">{desc}</p>
        </div>
      </div>

      {members.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-400">
          {emptyLabel}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {members.map(m => <MemberCard key={m.id} member={m} />)}
        </div>
      )}
    </div>
  );
};

export default function BoardDirectory({ members }: BoardDirectoryProps) {
  const { t } = useLang();

  const byCategory = (cat: BoardMemberCategory) =>
    members
      .filter(m => m.category === cat)
      .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

  const bureau = byCategory('BUREAU_EXECUTIF');
  const council = byCategory('CONSEIL_NATIONAL');

  return (
    <div className="space-y-8" id="board-directory-container">
      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-blue-deep to-brand-blue rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg shadow-brand-blue/10">
        <div className="absolute top-0 end-0 w-64 h-64 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="relative z-10 max-w-3xl text-start">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-gold/25 text-brand-gold border border-brand-gold/20 mb-3">
            <Users className="w-3.5 h-3.5" />
            {t('board.title')}
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">{t('board.title')}</h2>
          <p className="mt-2 text-sm text-brand-blue-light/90 leading-relaxed">{t('board.subtitle')}</p>
        </div>
      </div>

      <Section
        icon={<Building2 className="w-5 h-5" />}
        title={t('board.bureau')}
        desc={t('board.bureauDesc')}
        count={bureau.length}
        members={bureau}
        emptyLabel={t('board.empty')}
        membersLabel={t('board.members')}
      />

      <Section
        icon={<Landmark className="w-5 h-5" />}
        title={t('board.council')}
        desc={t('board.councilDesc')}
        count={council.length}
        members={council}
        emptyLabel={t('board.empty')}
        membersLabel={t('board.members')}
      />
    </div>
  );
}
