import { describe, it, expect } from 'vitest';
import {
  stepDadosPessoaisSchema,
  stepFormacaoSchema,
  stepAreasInteresseSchema,
  stepExperienciasHabilidadesSchema,
  stepDetalhesExperienciasSchema,
  stepInformacoesComplementaresSchema,
} from './validation';

describe('Validation Schemas', () => {
  describe('stepDadosPessoaisSchema', () => {
    it('validates correct data', () => {
      const validData = {
        full_name: 'João da Silva',
        birth_date: '2000-01-15',
        email: 'joao@email.com',
        whatsapp: '61999999999',
        city: 'Brasília - DF',
      };
      
      const result = stepDadosPessoaisSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects short name', () => {
      const invalidData = {
        full_name: 'Jo',
        birth_date: '2000-01-15',
        email: 'joao@email.com',
        whatsapp: '61999999999',
        city: 'Brasília',
      };
      
      const result = stepDadosPessoaisSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects invalid email', () => {
      const invalidData = {
        full_name: 'João da Silva',
        birth_date: '2000-01-15',
        email: 'invalid-email',
        whatsapp: '61999999999',
        city: 'Brasília',
      };
      
      const result = stepDadosPessoaisSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects empty required fields', () => {
      const invalidData = {
        full_name: '',
        birth_date: '',
        email: '',
        whatsapp: '',
        city: '',
      };
      
      const result = stepDadosPessoaisSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('stepFormacaoSchema', () => {
    it('validates correct data', () => {
      const validData = {
        institution: 'Universidade de Brasília',
        course: 'Ciência da Computação',
        current_period: '5º',
        study_shift: 'Noturno',
        graduation_month: 12,
        graduation_year: 2025,
      };
      
      const result = stepFormacaoSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('allows optional graduation fields', () => {
      const validData = {
        institution: 'UnB',
        course: 'Engenharia',
        current_period: '3º',
        study_shift: 'Integral',
      };
      
      const result = stepFormacaoSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('stepAreasInteresseSchema', () => {
    it('validates correct data', () => {
      const validData = {
        interest_areas: ['Tecnologia da Informação', 'Desenvolvimento de Software'],
        motivation: 'Quero aprender muito',
        contributions: 'Tenho experiência com programação',
      };
      
      const result = stepAreasInteresseSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects empty interest_areas', () => {
      const invalidData = {
        interest_areas: [],
        motivation: 'Quero aprender',
        contributions: 'Posso contribuir',
      };
      
      const result = stepAreasInteresseSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects short motivation text', () => {
      const invalidData = {
        interest_areas: ['TI'],
        motivation: 'Curto',
        contributions: 'Posso contribuir com minhas habilidades',
      };
      
      const result = stepAreasInteresseSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('stepExperienciasHabilidadesSchema', () => {
    it('validates with experience', () => {
      const validData = {
        tools: 'Python, JavaScript, Excel',
        has_experience: true,
      };
      
      const result = stepExperienciasHabilidadesSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('validates without experience', () => {
      const validData = {
        has_experience: false,
      };
      
      const result = stepExperienciasHabilidadesSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('stepDetalhesExperienciasSchema', () => {
    it('validates complete experience details', () => {
      const validData = {
        experience_type: 'Estágio anterior',
        experience_org: 'Empresa ABC',
        experience_period: '01/2023 - 06/2023',
        experience_activities: 'Desenvolvimento de sistemas web',
        experience_learnings: 'Aprendi sobre metodologias ágeis',
      };
      
      const result = stepDetalhesExperienciasSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('stepInformacoesComplementaresSchema', () => {
    it('validates correct data with LGPD consent', () => {
      const validData = {
        extra_info: 'Tenho disponibilidade imediata',
        how_did_you_hear: 'LinkedIn',
        lgpd_consent: true,
      };
      
      const result = stepInformacoesComplementaresSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('allows empty extra_info', () => {
      const validData = {
        how_did_you_hear: 'Indicação',
        lgpd_consent: true,
      };
      
      const result = stepInformacoesComplementaresSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects when LGPD consent is false', () => {
      const invalidData = {
        how_did_you_hear: 'LinkedIn',
        lgpd_consent: false,
      };
      
      const result = stepInformacoesComplementaresSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects when LGPD consent is missing', () => {
      const invalidData = {
        how_did_you_hear: 'LinkedIn',
      };
      
      const result = stepInformacoesComplementaresSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
