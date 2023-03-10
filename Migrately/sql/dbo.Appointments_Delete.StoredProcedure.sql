USE [Migrately]
GO
/****** Object:  StoredProcedure [dbo].[Appointments_Delete]    Script Date: 03/07/23 13:57:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: <Christopher Doupis>
-- Create date: <01-11-2023T15:45:00>
-- Description: Appointments Delete
-- Code Reviewer: 

-- MODIFIED BY:
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================

CREATE PROC [dbo].[Appointments_Delete]				
	    @Id int

/*---TEST CODE---

DECLARE @Id int = 1

SELECT *
FROM [dbo].[Appointments]
WHERE [Id] = @Id

EXECUTE [dbo].[Appointments_Delete]
		@Id

SELECT *
FROM [dbo].[Appointments]
WHERE [Id] = @Id

SELECT *
FROM [dbo].[Appointments]
*/

AS

BEGIN

	UPDATE [dbo].[Appointments]
		SET [StatusTypesId] = 5
	WHERE [Id] = @Id

END
GO
