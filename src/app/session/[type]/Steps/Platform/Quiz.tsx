'use client';

import {
  MarkingSchemeOptions,
  OptionalLimitOptions,
  TestFormatOptions,
  TestPlatformOptions,
  TestPurposeOptions,
  TestTypeOptions,
} from '@/Constants/TestDetailsOptions';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFormContext } from '@/hooks/useFormContext';
import {
  PartialSession,
  Session,
  SessionParams,
  SessionType,
  Steps,
  quizFields,
  quizSchema,
} from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';

const QuizForm = () => {
  const { type } = useParams<SessionParams>();

  const { formData, updateFormData, pushStep } = useFormContext();

  const form = useForm<quizFields>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      // TODO: Populate default values
    },
  });

  const onSubmit = useCallback((data: quizFields) => {
    const addedData: PartialSession = {
      // TODO: add payload here
    };

    updateFormData(addedData, Steps.TIMELINE);
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => onSubmit(data))} className="flex flex-col gap-4">
        <FormField
          disabled={type === SessionType.EDIT}
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Test Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Test Name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled={type === SessionType.EDIT}
          control={form.control}
          name="testType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Test Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Test Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TestTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="testFormat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Test Format</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Test Format" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TestFormatOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="testPurpose"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Test Purpose" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TestPurposeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled={type === SessionType.EDIT}
          control={form.control}
          name="testPlatform"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Test Platform</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Test Platform" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TestPlatformOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled={type === SessionType.EDIT}
          control={form.control}
          name="markingScheme"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marking Scheme</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Marking Scheme" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {MarkingSchemeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled={type === SessionType.EDIT}
          control={form.control}
          name="optionalLimit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Optional Limit</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Optional Limit" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {OptionalLimitOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {(formData as Session)?.id ? (
          <>
            <FormField
              disabled={type === SessionType.EDIT}
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Id</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Test Id" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={type === SessionType.EDIT}
              control={form.control}
              name="sessionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Session Id</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Test Session Id" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={type === SessionType.EDIT}
              control={form.control}
              name="sessionLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Session Link</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Test Session Link" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        ) : null}
        <FormField
          disabled={type === SessionType.EDIT}
          control={form.control}
          name="cmsId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CMS Test Id</FormLabel>
              <FormControl>
                <Input {...field} placeholder="CMS Test Id" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4 flex-col-reverse md:flex-row justify-between mt-4">
          <Button
            className="min-w-32"
            variant="outline"
            type="reset"
            onClick={() => pushStep(Steps.BASIC)}
          >
            Back
          </Button>
          <Button className="min-w-32" type="submit">
            Next
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default QuizForm;
