'use client';

import {
  BatchOptions,
  CourseOptions,
  GradeOptions,
  GroupOptions,
  StreamOptions,
} from '@/Constants/StudentDetailsOptions';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
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
import { useFormData } from '@/hooks/useFormData';
import { SessionParams, SessionType, Steps, studentFields, studentSchema } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

const StudentDetails = () => {
  const { type } = useParams<SessionParams>();
  const { formData, addFormData } = useFormData();

  const form = useForm<studentFields>({
    resolver: zodResolver(studentSchema),
    defaultValues: formData,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => addFormData(data, Steps.TEST))}
        className="flex flex-col gap-4"
      >
        <FormField
          disabled={type === SessionType.EDIT}
          control={form.control}
          name="group"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Program</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Program" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {GroupOptions.map((option) => (
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
          name="batch"
          rules={{
            required: true,
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Batch</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Batch" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {BatchOptions.map((option) => (
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
          name="grade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grade</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Grade" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {GradeOptions.map((option) => (
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
          name="course"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Course" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CourseOptions.map((option) => (
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
          name="stream"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stream</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Stream" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {StreamOptions.map((option) => (
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
          name="testTakers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Test Takers Count</FormLabel>
              <FormControl>
                <Input type="number" min={0} placeholder="Test Takers Count" {...field} />
              </FormControl>
              <FormDescription>Enter the no. of students expected to take the test</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="min-w-40 ml-auto">
          Next
        </Button>
      </form>
    </Form>
  );
};

export default StudentDetails;
