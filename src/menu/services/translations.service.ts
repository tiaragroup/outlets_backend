import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
import {
  Translation,
  TranslationModelType,
} from '../entities/translation.entity';

@Injectable()
export class TranslationsService {
  constructor(
    @InjectRepository(Translation)
    private readonly translationRepository: Repository<Translation>,
  ) {}

  async upsertTranslations(
    modelType: TranslationModelType,
    modelId: number,
    translations?: Record<string, Record<string, string>>,
  ) {
    if (!translations) return;

    for (const langCode of Object.keys(translations)) {
      const fields = translations[langCode];

      for (const fieldName of Object.keys(fields)) {
        await this.translationRepository.upsert(
          {
            modelType,
            modelId,
            langCode,
            fieldName,
            fieldValue: fields[fieldName],
          },
          ['modelType', 'modelId', 'langCode', 'fieldName'],
        );
      }
    }
  }

  async upsertTranslationsWithManager(
    manager: EntityManager,
    modelType: TranslationModelType,
    modelId: number,
    translations?: Record<string, Record<string, string>>,
  ) {
    if (!translations) return;

    const repo = manager.getRepository(Translation);

    for (const langCode of Object.keys(translations)) {
      const fields = translations[langCode];

      for (const fieldName of Object.keys(fields)) {
        await repo.upsert(
          {
            modelType,
            modelId,
            langCode,
            fieldName,
            fieldValue: fields[fieldName],
          },
          ['modelType', 'modelId', 'langCode', 'fieldName'],
        );
      }
    }
  }

  async getTranslations(modelType: TranslationModelType, modelIds: number[]) {
    if (!modelIds.length) return {};

    const rows = await this.translationRepository.find({
      where: {
        modelType,
        modelId: In(modelIds),
      },
    });

    const result: Record<number, Record<string, Record<string, string>>> = {};

    for (const row of rows) {
      if (!result[row.modelId]) {
        result[row.modelId] = {};
      }

      if (!result[row.modelId][row.langCode]) {
        result[row.modelId][row.langCode] = {};
      }

      result[row.modelId][row.langCode][row.fieldName] = row.fieldValue;
    }

    return result;
  }

  async getTranslationByLang(
    modelType: TranslationModelType,
    modelIds: number[],
    langCode = 'en',
    fallbackLangCode = 'en',
  ) {
    const allTranslations = await this.getTranslations(modelType, modelIds);
    const result: Record<number, Record<string, string>> = {};

    for (const modelId of modelIds) {
      const translations = allTranslations[modelId] || {};
      result[modelId] =
        translations[langCode] || translations[fallbackLangCode] || {};
    }

    return result;
  }

  async deleteByModel(modelType: TranslationModelType, modelId: number) {
    await this.translationRepository.delete({
      modelType,
      modelId,
    });
  }

  async deleteByModelIds(modelType: TranslationModelType, modelIds: number[]) {
    if (!modelIds.length) return;

    await this.translationRepository.delete({
      modelType,
      modelId: In(modelIds),
    });
  }
}